export function formatDuration(ms) {
  if (!ms && ms !== 0) return null;
  const totalMinutes = Math.round(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours} Std. ${minutes} Min.`;
  return `${minutes} Min.`;
}

export function formatTimestamp(ms) {
  if (!ms && ms !== 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function formatEpisodeTag(nummer) {
  return `N° ${String(nummer).padStart(3, '0')}`;
}

export function bestCoverUrl(links) {
  if (!links) return null;
  return (
    links.cover ||
    links.artwork ||
    links.cover_dreifragezeichen ||
    links.cover_kosmos ||
    links.cover_itunes ||
    null
  );
}
