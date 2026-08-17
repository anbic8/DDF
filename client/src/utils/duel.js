function weightFor(episode) {
  const comparisons = episode.rating?.comparisons || 0;
  return 1 / (comparisons + 1);
}

function pickWeighted(pool, exclude) {
  const candidates = exclude ? pool.filter((e) => e.nummer !== exclude.nummer) : pool;
  const totalWeight = candidates.reduce((sum, e) => sum + weightFor(e), 0);
  let r = Math.random() * totalWeight;
  for (const ep of candidates) {
    r -= weightFor(ep);
    if (r <= 0) return ep;
  }
  return candidates[candidates.length - 1];
}

export function pickDuelPair(episodes, lastPairKey) {
  const pool = episodes.filter((e) => !e.unvollständig);
  if (pool.length < 2) return null;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const a = pickWeighted(pool);
    const b = pickWeighted(pool, a);
    const key = [a.nummer, b.nummer].sort().join('-');
    if (key !== lastPairKey) {
      return { a, b, key };
    }
  }
  const a = pickWeighted(pool);
  const b = pickWeighted(pool, a);
  return { a, b, key: [a.nummer, b.nummer].sort().join('-') };
}
