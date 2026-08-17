async function handle(res) {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }
  return res.json();
}

export function fetchEpisodes() {
  return fetch('/api/episodes').then(handle);
}

export function triggerUpdate() {
  return fetch('/api/update', { method: 'POST' }).then(handle);
}

export function submitDuelResult(winner, loser) {
  return fetch('/api/duel/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ winner, loser }),
  }).then(handle);
}
