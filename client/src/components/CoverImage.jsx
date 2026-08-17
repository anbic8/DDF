import { useMemo, useState } from 'react';

function candidatesFor(links) {
  if (!links) return [];
  return [links.cover, links.artwork, links.cover_dreifragezeichen, links.cover_kosmos, links.cover_itunes].filter(
    Boolean,
  );
}

export default function CoverImage({ episode, className = '', alt }) {
  const candidates = useMemo(() => candidatesFor(episode.links), [episode.links]);
  const [index, setIndex] = useState(0);
  const src = candidates[index];

  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-panel-raised text-amber/70 font-display ${className}`}
        aria-label={alt || episode.titel}
      >
        <span className="text-3xl">?</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || `Cover: ${episode.titel}`}
      loading="lazy"
      className={className}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}
