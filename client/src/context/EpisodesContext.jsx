import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fetchEpisodes, submitDuelResult, triggerUpdate } from '../api.js';

const EpisodesContext = createContext(null);

export function EpisodesProvider({ children }) {
  const [episodes, setEpisodes] = useState([]);
  const [dbInfo, setDbInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    return fetchEpisodes()
      .then((data) => {
        setEpisodes(data.episodes);
        setDbInfo(data.dbInfo);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runUpdate = useCallback(async () => {
    setUpdating(true);
    try {
      const result = await triggerUpdate();
      await load();
      return result;
    } finally {
      setUpdating(false);
    }
  }, [load]);

  const recordDuel = useCallback(async (winnerNummer, loserNummer) => {
    const updated = await submitDuelResult(winnerNummer, loserNummer);
    setEpisodes((prev) =>
      prev.map((ep) => (updated[ep.nummer] ? { ...ep, rating: updated[ep.nummer] } : ep)),
    );
  }, []);

  return (
    <EpisodesContext.Provider
      value={{ episodes, dbInfo, loading, error, updating, runUpdate, recordDuel, reload: load }}
    >
      {children}
    </EpisodesContext.Provider>
  );
}

export function useEpisodes() {
  const ctx = useContext(EpisodesContext);
  if (!ctx) throw new Error('useEpisodes must be used within EpisodesProvider');
  return ctx;
}
