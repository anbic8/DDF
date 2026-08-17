const fs = require('fs');
const path = require('path');
const { DEFAULT_RATING } = require('./elo');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const SERIE_PATH = path.join(DATA_DIR, 'serie.json');
const RATINGS_PATH = path.join(DATA_DIR, 'ratings.json');
const SEED_PATH = path.join(__dirname, '..', '..', 'Serie.json');

const SOURCE_URL = 'https://dreimetadaten.de/data/Serie.json';

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function ensureSeeded() {
  ensureDataDir();
  if (!fs.existsSync(SERIE_PATH)) {
    if (fs.existsSync(SEED_PATH)) {
      fs.copyFileSync(SEED_PATH, SERIE_PATH);
    } else {
      fs.writeFileSync(SERIE_PATH, JSON.stringify({ dbInfo: {}, serie: [] }, null, 2));
    }
  }
  if (!fs.existsSync(RATINGS_PATH)) {
    fs.writeFileSync(RATINGS_PATH, JSON.stringify({}, null, 2));
  }
}

function readSerie() {
  ensureSeeded();
  return JSON.parse(fs.readFileSync(SERIE_PATH, 'utf8'));
}

function readRatings() {
  ensureSeeded();
  return JSON.parse(fs.readFileSync(RATINGS_PATH, 'utf8'));
}

function writeRatings(ratings) {
  fs.writeFileSync(RATINGS_PATH, JSON.stringify(ratings, null, 2));
}

function writeSerie(serieData) {
  fs.writeFileSync(SERIE_PATH, JSON.stringify(serieData, null, 2));
}

function getEpisodesWithRatings() {
  const serieData = readSerie();
  const ratings = readRatings();
  const episodes = (serieData.serie || []).map((ep) => ({
    ...ep,
    rating: ratings[ep.nummer] || { elo: DEFAULT_RATING, comparisons: 0, wins: 0 },
  }));
  return { dbInfo: serieData.dbInfo || {}, episodes };
}

function reconcileRatingsWithSerie(serieData) {
  const ratings = readRatings();
  let added = 0;
  for (const ep of serieData.serie || []) {
    if (!ratings[ep.nummer]) {
      ratings[ep.nummer] = { elo: DEFAULT_RATING, comparisons: 0, wins: 0 };
      added += 1;
    }
  }
  writeRatings(ratings);
  return added;
}

async function updateFromSource() {
  const res = await fetch(SOURCE_URL, { headers: { Accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`Download fehlgeschlagen: HTTP ${res.status}`);
  }
  const newData = await res.json();
  if (!newData || !Array.isArray(newData.serie)) {
    throw new Error('Antwort enthält kein gültiges "serie"-Array');
  }

  const previous = fs.existsSync(SERIE_PATH) ? readSerie() : { serie: [] };
  const previousCount = (previous.serie || []).length;

  writeSerie(newData);
  const added = reconcileRatingsWithSerie(newData);

  return {
    dbInfo: newData.dbInfo || {},
    totalEpisodes: newData.serie.length,
    previousCount,
    added,
  };
}

function recordDuelResult(winnerNummer, loserNummer) {
  const { applyResult } = require('./elo');
  const ratings = readRatings();

  const winnerEntry = ratings[winnerNummer] || { elo: DEFAULT_RATING, comparisons: 0, wins: 0 };
  const loserEntry = ratings[loserNummer] || { elo: DEFAULT_RATING, comparisons: 0, wins: 0 };

  const { winner, loser } = applyResult(winnerEntry, loserEntry);

  ratings[winnerNummer] = winner;
  ratings[loserNummer] = loser;
  writeRatings(ratings);

  return {
    [winnerNummer]: winner,
    [loserNummer]: loser,
  };
}

module.exports = {
  ensureSeeded,
  getEpisodesWithRatings,
  updateFromSource,
  recordDuelResult,
};
