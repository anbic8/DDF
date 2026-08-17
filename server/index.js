const path = require('path');
const express = require('express');
const dataStore = require('./lib/dataStore');

const app = express();
const PORT = process.env.PORT || 3000;

dataStore.ensureSeeded();

app.use(express.json());

app.get('/api/episodes', (req, res) => {
  try {
    const data = dataStore.getEpisodesWithRatings();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/update', async (req, res) => {
  try {
    const result = await dataStore.updateFromSource();
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.post('/api/duel/result', (req, res) => {
  const { winner, loser } = req.body || {};
  if (!Number.isInteger(winner) || !Number.isInteger(loser) || winner === loser) {
    res.status(400).json({ error: 'Ungültige Duell-Daten' });
    return;
  }
  try {
    const updated = dataStore.recordDuelResult(winner, loser);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Die drei ??? Server läuft auf Port ${PORT}`);
});
