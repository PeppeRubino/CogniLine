// Header.js
import React, { useState, useMemo } from 'react';
import authorsData from '../JSON/authorsData.json';

const Header = ({ onSearch, onFilterAuthor, onFilterYear }) => {
  const [query, setQuery] = useState('');

  // costruisco la lista autori e la lista anni (unici, ordinati)
  const { authorNames, authorYears } = useMemo(() => {
    const names = [];
    const yearsSet = new Set();
    if (Array.isArray(authorsData)) {
      for (const a of authorsData) {
        if (a?.name) names.push(a.name);
        if (typeof a?.year === 'number' || (typeof a?.year === 'string' && /^\-?\d+$/.test(a.year))) {
          yearsSet.add(String(a.year));
        }
      }
    }
    const years = Array.from(yearsSet).sort((x, y) => Number(x) - Number(y));
    return { authorNames: names, authorYears: years };
  }, []);

  // chiamata quando si invia il form (enter)
  const handleSubmit = (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (onSearch) onSearch(q);

    // se l'input corrisponde esattamente a un autore -> chiama onFilterAuthor
    if (onFilterAuthor && authorNames.includes(q)) {
      onFilterAuthor(q);
      return;
    }

    // se l'input è un anno valido -> chiama onFilterYear
    if (onFilterYear && /^-?\d{1,4}$/.test(q)) {
      const maybeYear = Number(q);
      if (!Number.isNaN(maybeYear)) {
        onFilterYear(maybeYear);
      }
    }
  };

  // chiamata ad ogni cambiamento (ricerca live)
  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);

    const trimmed = v.trim();

    // sempre onSearch in real-time (se fornita)
    if (onSearch) onSearch(trimmed);

    // se l'utente ha scelto un autore esatto (datalist selection),
    // chiamiamo onFilterAuthor per sincronizzare la UI.
    if (onFilterAuthor && authorNames.includes(trimmed)) {
      onFilterAuthor(trimmed);
      return;
    }

    // se l'utente ha digitato un anno (es. "1880") chiamiamo onFilterYear
    if (onFilterYear && /^-?\d{1,4}$/.test(trimmed)) {
      const maybeYear = Number(trimmed);
      if (!Number.isNaN(maybeYear)) {
        onFilterYear(maybeYear);
        return;
      }
    }

    // se il campo è vuoto, comunichiamo possibile reset (passiamo empty string / null)
    if (trimmed === '') {
      if (onFilterAuthor) onFilterAuthor('');
      if (onFilterYear) onFilterYear(null);
    }
  };

  return (
    <header className="w-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      {/* TOP ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex items-center gap-4">
        {/* left: logo */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 flex items-center justify-center rounded-md bg-zinc-100/6 shadow-[0_6px_18px_rgba(0,0,0,0.6)] border border-zinc-800">
            <img src="/favicon.ico" alt="icon" className="w-5 h-5 block" />
          </div>

          {/* mobile small title */}
          <div className="flex flex-col sm:hidden">
            <h1 className="text-lg font-semibold tracking-tight">Chronos</h1>
            <span className="text-zinc-400 text-xs -mt-0.5">Timeline della psicologia</span>
          </div>
        </div>

        {/* center title */}
        <div className="flex-1 flex justify-center">
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
              Psychology Timeline
            </h1>
            <p className="mt-2 text-zinc-400 text-sm sm:text-base hidden sm:block">
              Timeline della psicologia
            </p>
          </div>
        </div>

        {/* right area left empty (we use the single bar below) */}
        <div className="hidden sm:flex items-center gap-3 justify-end w-full sm:w-auto" />
      </div>

      {/* BOTTOM ROW: search (with datalists for author & year) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <div className="w-full">
            <div className="mx-auto w-full max-w-3xl relative">
              {/* search icon */}
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="11" cy="11" r="5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <input
                id="global-search"
                list="authors-and-years"
                type="search"
                value={query}
                onChange={handleChange}
                placeholder="Search author, year, category..."
                className="w-full py-3 sm:py-4 pl-12 pr-4 rounded-xl bg-zinc-800/50 border border-zinc-700 placeholder:text-zinc-400 text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                aria-label="Cerca nella timeline"
                autoComplete="off"
              />

              {/* unified datalist: authors first, then years */}
              <datalist id="authors-and-years">
                {authorNames.map((n, i) => <option key={`a-${i}`} value={n} />)}
                {authorYears.map((y, i) => <option key={`y-${i}`} value={y} />)}
              </datalist>
            </div>
          </div>

          {/* small-screen placeholder area (kept empty because filters moved into the single bar) */}
          <div className="w-full sm:hidden" />
        </form>
      </div>
    </header>
  );
};

export default Header;
