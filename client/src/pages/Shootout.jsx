import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEpisodes } from '../context/EpisodesContext.jsx';
import { pickDuelPair } from '../utils/duel.js';
import DuelCard from '../components/DuelCard.jsx';

export default function Shootout() {
  const { episodes, loading, recordDuel } = useEpisodes();
  const [pair, setPair] = useState(null);
  const [choice, setChoice] = useState(null); // nummer of chosen winner, drives animation
  const [locked, setLocked] = useState(false);
  const [sessionDuels, setSessionDuels] = useState(0);
  const [roundKey, setRoundKey] = useState(0);

  const totalDuels = useMemo(
    () => Math.round(episodes.reduce((sum, e) => sum + (e.rating?.comparisons || 0), 0) / 2),
    [episodes],
  );

  const nextPair = useCallback(
    (excludeKey) => {
      const p = pickDuelPair(episodes, excludeKey);
      setPair(p);
      setChoice(null);
      setLocked(false);
    },
    [episodes],
  );

  useEffect(() => {
    if (!loading && episodes.length > 1 && !pair) {
      nextPair(null);
    }
  }, [loading, episodes, pair, nextPair]);

  async function handleChoose(winnerEp) {
    if (locked || !pair) return;
    const loserEp = pair.a.nummer === winnerEp.nummer ? pair.b : pair.a;
    setLocked(true);
    setChoice(winnerEp.nummer);
    setSessionDuels((n) => n + 1);
    recordDuel(winnerEp.nummer, loserEp.nummer).catch(() => {});
    setTimeout(() => {
      setRoundKey((k) => k + 1);
      nextPair(pair.key);
    }, 650);
  }

  function handleSkip() {
    if (locked || !pair) return;
    setRoundKey((k) => k + 1);
    nextPair(pair.key);
  }

  if (loading) return <p className="py-16 text-center text-muted">Akten werden geladen …</p>;
  if (episodes.length < 2) return <p className="py-16 text-center text-muted">Zu wenige Folgen für ein Shootout.</p>;
  if (!pair) return null;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="font-display text-2xl text-paper sm:text-3xl">Welche Folge gefällt dir besser?</h1>
        <p className="mt-2 text-[13px] text-muted">
          Tippe auf dein Favorit. Je öfter du wählst, desto klarer wird deine Rangliste.
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={roundKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid w-full max-w-3xl grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]"
        >
          <DuelCard
            episode={pair.a}
            state={choice ? (choice === pair.a.nummer ? 'winner' : 'loser') : 'idle'}
            onChoose={handleChoose}
            disabled={locked}
          />
          <span className="justify-self-center font-display text-lg italic text-hairline sm:text-xl">vs</span>
          <DuelCard
            episode={pair.b}
            state={choice ? (choice === pair.b.nummer ? 'winner' : 'loser') : 'idle'}
            onChoose={handleChoose}
            disabled={locked}
          />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={handleSkip}
          disabled={locked}
          className="font-mono text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-paper disabled:opacity-40"
        >
          Überspringen
        </button>
        <span className="font-mono text-[12px] text-muted">
          {sessionDuels} Duelle heute · {totalDuels} insgesamt
        </span>
      </div>
    </div>
  );
}
