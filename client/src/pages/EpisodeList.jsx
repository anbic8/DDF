import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { useEpisodes } from '../context/EpisodesContext.jsx';
import SearchBar from '../components/SearchBar.jsx';
import EpisodeCard from '../components/EpisodeCard.jsx';

const SORTS = {
  nummer: { label: 'Nummer', fn: (a, b) => a.nummer - b.nummer },
  neu: {
    label: 'Neueste',
    fn: (a, b) => new Date(b.veröffentlichungsdatum || 0) - new Date(a.veröffentlichungsdatum || 0),
  },
  beliebt: {
    label: 'Beliebtheit',
    fn: (a, b) => (b.rating?.elo ?? 1500) - (a.rating?.elo ?? 1500),
  },
};

export default function EpisodeList() {
  const { episodes, loading, error } = useEpisodes();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('nummer');

  const fuse = useMemo(
    () =>
      new Fuse(episodes, {
        keys: [
          { name: 'titel', weight: 0.4 },
          { name: 'autor', weight: 0.25 },
          { name: 'hörspielskriptautor', weight: 0.1 },
          { name: 'gesamtbeschreibung', weight: 0.25 },
        ],
        threshold: 0.32,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [episodes],
  );

  const filtered = useMemo(() => {
    const base = query.trim() ? fuse.search(query.trim()).map((r) => r.item) : episodes;
    return [...base].sort(SORTS[sort].fn);
  }, [query, fuse, episodes, sort]);

  if (loading) {
    return <p className="py-16 text-center text-muted">Akten werden geladen …</p>;
  }
  if (error) {
    return <p className="py-16 text-center text-redtag">Fehler beim Laden: {error}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <SearchBar value={query} onChange={setQuery} resultCount={filtered.length} />
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
          <span>Sortieren:</span>
          {Object.entries(SORTS).map(([key, s]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSort(key)}
              className={sort === key ? 'text-amber' : 'hover:text-paper transition-colors'}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">Keine Akte passt zu „{query}“.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((ep) => (
            <EpisodeCard key={ep.nummer} episode={ep} />
          ))}
        </div>
      )}
    </div>
  );
}
