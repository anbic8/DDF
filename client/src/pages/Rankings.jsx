import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useEpisodes } from '../context/EpisodesContext.jsx';
import CoverImage from '../components/CoverImage.jsx';
import { computeAuthorStats } from '../utils/authorStats.js';
import { formatEpisodeTag } from '../utils/format.js';

const TABS = [
  { key: 'folgen', label: 'Folgen' },
  { key: 'autor', label: 'Autoren' },
  { key: 'hörspielskriptautor', label: 'Skriptautoren' },
];

const MIN_OPTIONS = [0, 5, 15];

function RankRow({ rank, children }) {
  return (
    <div className="flex items-center gap-4 border-b border-hairline/60 py-3">
      <span className="w-8 shrink-0 text-right font-mono text-[15px] text-hairline">{rank}</span>
      {children}
    </div>
  );
}

export default function Rankings() {
  const { episodes, loading } = useEpisodes();
  const [tab, setTab] = useState('folgen');
  const [minDuels, setMinDuels] = useState(0);

  const rankedEpisodes = useMemo(
    () =>
      episodes
        .filter((e) => (e.rating?.comparisons || 0) > 0)
        .sort((a, b) => b.rating.elo - a.rating.elo),
    [episodes],
  );

  const authorStats = useMemo(() => {
    if (tab === 'folgen') return [];
    return computeAuthorStats(episodes, tab).filter((s) => s.totalComparisons >= minDuels);
  }, [episodes, tab, minDuels]);

  if (loading) return <p className="py-16 text-center text-muted">Akten werden geladen …</p>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-paper sm:text-3xl">Rangliste</h1>
        <p className="mt-1 text-[13px] text-muted">Basierend auf deinen Shootout-Duellen.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-5 font-mono text-[12px] uppercase tracking-[0.1em]">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={t.key === tab ? 'text-amber' : 'text-muted hover:text-paper transition-colors'}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab !== 'folgen' && (
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted">
            <span>Mind. Duelle:</span>
            {MIN_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMinDuels(n)}
                className={n === minDuels ? 'text-verdigris' : 'hover:text-paper transition-colors'}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </div>

      {tab === 'folgen' ? (
        rankedEpisodes.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {rankedEpisodes.map((ep, i) => (
              <RankRow key={ep.nummer} rank={i + 1}>
                <Link to={`/folge/${ep.nummer}`} className="flex flex-1 items-center gap-3 min-w-0">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-hairline bg-panel-raised">
                    <CoverImage episode={ep} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-display text-[15px] text-paper">… {ep.titel}</p>
                    <p className="truncate text-[12px] text-muted">
                      {formatEpisodeTag(ep.nummer)} · {ep.autor || 'Unbekannt'}
                    </p>
                  </div>
                </Link>
                <div className="shrink-0 text-right font-mono text-[13px]">
                  <span className="text-verdigris">{Math.round(ep.rating.elo)}</span>
                  <span className="ml-1.5 text-muted">({ep.rating.comparisons})</span>
                </div>
              </RankRow>
            ))}
          </div>
        )
      ) : authorStats.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {authorStats.map((s, i) => (
            <RankRow key={s.name} rank={i + 1}>
              <div className="flex flex-1 items-center gap-3 min-w-0">
                {s.favorite && (
                  <Link
                    to={`/folge/${s.favorite.nummer}`}
                    className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-hairline bg-panel-raised"
                    title={`Lieblingsfolge: ${s.favorite.titel}`}
                  >
                    <CoverImage episode={s.favorite} className="h-full w-full object-cover" />
                  </Link>
                )}
                <div className="min-w-0">
                  <p className="truncate font-display text-[15px] text-paper">{s.name}</p>
                  <p className="truncate text-[12px] text-muted">
                    {s.episodeCount} Folge{s.episodeCount === 1 ? '' : 'n'} · {s.totalComparisons} Duelle
                  </p>
                </div>
              </div>
              <div className="shrink-0 text-right font-mono text-[13px] text-verdigris">
                {Math.round(s.avgElo)}
              </div>
            </RankRow>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-sm border border-dashed border-hairline py-16 text-center">
      <p className="text-muted">Noch keine Daten. Starte ein paar Shootout-Duelle.</p>
      <Link to="/shootout" className="mt-3 inline-block font-mono text-sm text-amber hover:underline">
        Zum Shootout →
      </Link>
    </div>
  );
}
