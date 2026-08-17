import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useEpisodes } from '../context/EpisodesContext.jsx';

const navItems = [
  { to: '/', label: 'Akten', end: true },
  { to: '/shootout', label: 'Shootout' },
  { to: '/rangliste', label: 'Rangliste' },
];

function navClass({ isActive }) {
  return [
    'font-mono text-[11px] sm:text-[13px] tracking-[0.1em] uppercase px-0.5 py-1 border-b transition-colors whitespace-nowrap',
    isActive
      ? 'text-amber border-amber'
      : 'text-muted border-transparent hover:text-paper hover:border-hairline',
  ].join(' ');
}

function RefreshIcon({ spinning }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 ${spinning ? 'animate-spin' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    >
      <path d="M16.5 10a6.5 6.5 0 1 1-2.1-4.8" />
      <path d="M16.7 3.5v3.7H13" />
    </svg>
  );
}

export default function Header() {
  const { dbInfo, updating, runUpdate } = useEpisodes();
  const [status, setStatus] = useState(null);

  async function handleUpdate() {
    setStatus(null);
    try {
      const result = await runUpdate();
      setStatus({
        type: 'ok',
        text:
          result.added > 0
            ? `${result.added} neue Folge${result.added === 1 ? '' : 'n'}`
            : 'Keine neuen Folgen',
      });
    } catch (err) {
      setStatus({ type: 'error', text: err.message || 'Fehlgeschlagen' });
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-amber/40 bg-panel font-display text-lg text-amber">
            ?
          </span>
          <span className="hidden font-display text-base tracking-wide text-paper sm:inline">
            Die drei <span className="text-amber">???</span>
          </span>
        </NavLink>

        <nav className="flex items-center gap-3 sm:gap-5">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex shrink-0 flex-col items-end">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={updating}
            title="Akte aktualisieren"
            className="flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.1em] text-verdigris hover:text-amber disabled:opacity-50 transition-colors"
          >
            <RefreshIcon spinning={updating} />
            <span className="hidden sm:inline">{updating ? 'Aktualisiere…' : 'Aktualisieren'}</span>
          </button>
          <span className="mt-0.5 hidden text-[11px] text-muted sm:block">
            {status ? (
              <span className={status.type === 'error' ? 'text-redtag' : 'text-verdigris'}>{status.text}</span>
            ) : dbInfo?.lastModified ? (
              `Stand: ${new Date(dbInfo.lastModified).toLocaleDateString('de-DE')}`
            ) : null}
          </span>
        </div>
      </div>
    </header>
  );
}
