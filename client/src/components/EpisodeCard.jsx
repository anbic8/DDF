import { Link } from 'react-router-dom';
import CoverImage from './CoverImage.jsx';
import { formatEpisodeTag } from '../utils/format.js';

export default function EpisodeCard({ episode }) {
  if (episode.unvollständig) {
    return (
      <div className="group flex flex-col overflow-hidden rounded-sm border border-hairline/60 bg-panel/40 opacity-60">
        <div className="relative aspect-square w-full overflow-hidden bg-panel-raised">
          <CoverImage episode={episode} className="h-full w-full object-cover grayscale" />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-muted">{formatEpisodeTag(episode.nummer)}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber">Demnächst</span>
          </div>
          <h3 className="font-display text-[15px] leading-snug text-paper-dim">… {episode.titel}</h3>
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/folge/${episode.nummer}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-hairline bg-panel transition-all hover:-translate-y-0.5 hover:border-amber/50 hover:shadow-spotlight"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-panel-raised">
        <CoverImage
          episode={episode}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-muted">{formatEpisodeTag(episode.nummer)}</span>
          {episode.rating?.comparisons > 0 && (
            <span className="font-mono text-[11px] text-verdigris">{Math.round(episode.rating.elo)}</span>
          )}
        </div>
        <h3 className="font-display text-[15px] leading-snug text-paper group-hover:text-amber transition-colors">
          … {episode.titel}
        </h3>
        <p className="mt-auto truncate text-[12px] text-muted">{episode.autor || 'Unbekannt'}</p>
      </div>
    </Link>
  );
}
