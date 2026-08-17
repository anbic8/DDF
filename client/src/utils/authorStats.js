export function computeAuthorStats(episodes, field) {
  const groups = new Map();

  for (const ep of episodes) {
    const name = ep[field];
    if (!name || ep.unvollständig) continue;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(ep);
  }

  const stats = [];
  for (const [name, eps] of groups) {
    const totalComparisons = eps.reduce((sum, e) => sum + (e.rating?.comparisons || 0), 0);
    const avgElo = eps.reduce((sum, e) => sum + (e.rating?.elo ?? 1500), 0) / eps.length;
    const favorite = [...eps].sort((a, b) => (b.rating?.elo ?? 1500) - (a.rating?.elo ?? 1500))[0];
    stats.push({
      name,
      episodeCount: eps.length,
      totalComparisons,
      avgElo,
      favorite,
    });
  }

  return stats.sort((a, b) => b.avgElo - a.avgElo);
}
