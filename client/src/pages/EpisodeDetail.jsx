import { Link, useParams } from 'react-router-dom';
import { useEpisodes } from '../context/EpisodesContext.jsx';
import CoverImage from '../components/CoverImage.jsx';
import { formatDate, formatDuration, formatEpisodeTag, formatTimestamp } from '../utils/format.js';

const LINK_LABELS = {
  spotify: 'Spotify',
  appleMusic: 'Apple Music',
  amazonMusic: 'Amazon Music',
  amazon: 'Amazon',
  deezer: 'Deezer',
  youTubeMusic: 'YouTube Music',
  bookbeat: 'BookBeat',
  dreifragezeichen: 'dreifragezeichen.de',
};

export default function EpisodeDetail() {
  const { nummer } = useParams();
  const { episodes, loading } = useEpisodes();

  if (loading) return <p className="py-16 text-center text-muted">Akte wird geladen …</p>;

  const episode = episodes.find((e) => String(e.nummer) === nummer);
  if (!episode) {
    return (
      <div className="py-16 text-center text-muted">
        <p>Diese Akte existiert nicht.</p>
        <Link to="/" className="mt-3 inline-block font-mono text-sm text-amber hover:underline">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  const streamingLinks = Object.entries(episode.links || {}).filter(([key]) => LINK_LABELS[key]);

  return (
    <article className="flex flex-col gap-10">
      <Link to="/" className="w-fit font-mono text-[12px] uppercase tracking-[0.1em] text-muted hover:text-amber">
        ← Alle Akten
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[280px_1fr]">
        <div className="mx-auto w-full max-w-xs md:mx-0">
          <div className="aspect-square overflow-hidden rounded-sm border border-hairline bg-panel-raised shadow-spotlight">
            <CoverImage episode={episode} className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="font-mono text-[12px] tracking-[0.15em] text-amber">
              Fall {formatEpisodeTag(episode.nummer)}
              {episode.unvollständig ? ' · Demnächst' : ''}
            </span>
            <h1 className="font-display text-3xl leading-tight text-paper sm:text-4xl">… {episode.titel}</h1>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 font-body text-[13px] sm:grid-cols-3">
            {episode.autor && (
              <div>
                <dt className="text-muted">Autor</dt>
                <dd className="text-paper">{episode.autor}</dd>
              </div>
            )}
            {episode.hörspielskriptautor && (
              <div>
                <dt className="text-muted">Hörspielskript</dt>
                <dd className="text-paper">{episode.hörspielskriptautor}</dd>
              </div>
            )}
            {episode.veröffentlichungsdatum && (
              <div>
                <dt className="text-muted">Veröffentlicht</dt>
                <dd className="text-paper">{formatDate(episode.veröffentlichungsdatum)}</dd>
              </div>
            )}
            {episode.gesamtdauer ? (
              <div>
                <dt className="text-muted">Laufzeit</dt>
                <dd className="text-paper">{formatDuration(episode.gesamtdauer)}</dd>
              </div>
            ) : null}
            {episode.rating?.comparisons > 0 && (
              <div>
                <dt className="text-muted">Shootout-Rating</dt>
                <dd className="font-mono text-verdigris">
                  {Math.round(episode.rating.elo)}{' '}
                  <span className="text-muted">({episode.rating.comparisons} Duelle)</span>
                </dd>
              </div>
            )}
          </dl>

          {episode.gesamtbeschreibung && (
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-paper-dim">
              {episode.gesamtbeschreibung}
            </p>
          )}

          {streamingLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {streamingLinks.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-sm border border-hairline px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-muted transition-colors hover:border-verdigris hover:text-verdigris"
                >
                  {LINK_LABELS[key]}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {episode.kapitel?.length > 0 && (
        <section>
          <h2 className="mb-3 font-mono text-[12px] uppercase tracking-[0.15em] text-amber">Kapitel</h2>
          <ol className="divide-y divide-hairline border-y border-hairline">
            {episode.kapitel.map((k, i) => (
              <li key={i} className="flex items-center justify-between gap-4 py-2.5">
                <span className="text-[14px] text-paper-dim">
                  <span className="mr-3 font-mono text-muted">{String(i + 1).padStart(2, '0')}</span>
                  {k.titel}
                </span>
                <span className="shrink-0 font-mono text-[12px] text-muted">{formatTimestamp(k.start)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {episode.sprechrollen?.length > 0 && (
        <section>
          <h2 className="mb-3 font-mono text-[12px] uppercase tracking-[0.15em] text-amber">Besetzung</h2>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
            {episode.sprechrollen.map((r, i) => (
              <li key={i} className="flex items-baseline justify-between gap-3 border-b border-hairline/60 py-1.5">
                <span className="text-[14px] text-paper-dim">{r.rolle}</span>
                <span className="shrink-0 text-right text-[13px] text-muted">
                  {r.sprecher}
                  {r.pseudonym ? <span className="text-hairline"> ({r.pseudonym})</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
