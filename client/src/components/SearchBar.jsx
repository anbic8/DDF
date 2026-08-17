export default function SearchBar({ value, onChange, resultCount }) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3 rounded-sm border border-hairline bg-panel px-4 py-3 focus-within:border-amber/60 transition-colors">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="8.5" cy="8.5" r="6" />
          <path d="M13.2 13.2 18 18" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Titel, Autor oder Inhalt durchsuchen …"
          className="w-full bg-transparent font-body text-[15px] text-paper placeholder:text-muted focus:outline-none"
        />
        {value && (
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-muted">
            {resultCount} {resultCount === 1 ? 'Treffer' : 'Treffer'}
          </span>
        )}
      </div>
    </div>
  );
}
