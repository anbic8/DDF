const DEFAULT_RATING = 1500;

function kFactorFor(comparisons) {
  if (comparisons < 5) return 40;
  if (comparisons < 15) return 24;
  return 16;
}

function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

function applyResult(winnerEntry, loserEntry) {
  const winner = winnerEntry || { elo: DEFAULT_RATING, comparisons: 0 };
  const loser = loserEntry || { elo: DEFAULT_RATING, comparisons: 0 };

  const expectedWinner = expectedScore(winner.elo, loser.elo);
  const expectedLoser = 1 - expectedWinner;

  const kWinner = kFactorFor(winner.comparisons);
  const kLoser = kFactorFor(loser.comparisons);

  const newWinner = {
    elo: Math.round((winner.elo + kWinner * (1 - expectedWinner)) * 100) / 100,
    comparisons: winner.comparisons + 1,
    wins: (winner.wins || 0) + 1,
  };
  const newLoser = {
    elo: Math.round((loser.elo + kLoser * (0 - expectedLoser)) * 100) / 100,
    comparisons: loser.comparisons + 1,
    wins: loser.wins || 0,
  };

  return { winner: newWinner, loser: newLoser };
}

module.exports = { DEFAULT_RATING, applyResult, kFactorFor, expectedScore };
