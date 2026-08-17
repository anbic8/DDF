import { motion } from 'framer-motion';
import CoverImage from './CoverImage.jsx';
import { formatEpisodeTag } from '../utils/format.js';

export default function DuelCard({ episode, state, onChoose, disabled }) {
  // state: 'idle' | 'winner' | 'loser'
  const isLoser = state === 'loser';
  const isWinner = state === 'winner';

  return (
    <motion.button
      type="button"
      onClick={() => onChoose(episode)}
      disabled={disabled}
      className="group relative flex w-full flex-col overflow-hidden rounded-sm border bg-panel text-left focus-visible:outline-amber"
      animate={{
        borderColor: isWinner ? 'rgba(227,165,66,0.7)' : 'rgba(43,49,61,1)',
        scale: isWinner ? 1.02 : isLoser ? 0.97 : 1,
        opacity: isLoser ? 0.35 : 1,
        filter: isLoser ? 'grayscale(0.8) brightness(0.6)' : 'grayscale(0) brightness(1)',
      }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      whileHover={!disabled ? { y: -2 } : {}}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-panel-raised sm:aspect-square">
        <CoverImage episode={episode} className="h-full w-full object-cover" />
        {isWinner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 30%, rgba(227,165,66,0.35), transparent 65%)',
            }}
          />
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <span className="font-mono text-[11px] text-muted">{formatEpisodeTag(episode.nummer)}</span>
        <h3 className="font-display text-lg leading-snug text-paper sm:text-xl">… {episode.titel}</h3>
        <p className="text-[13px] text-muted">{episode.autor || 'Unbekannt'}</p>
      </div>
    </motion.button>
  );
}
