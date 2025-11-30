import React, { useState } from "react";
import authorsData from "../data/authorsData.json";

const Header = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (onSearch) onSearch(q.trim()); // ricerca live
  };

  return (
    <header className="w-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white">
      {/* TOP ROW */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex items-center gap-4">
        {/* center title */}
        <div className="text-center flex-row flex-1">
          <div className="text-center flex items-center justify-center">
            <div className="w-10 h-10 mr-4 flex items-center justify-center rounded-md bg-zinc-100/6 shadow-[0_6px_18px_rgba(0,0,0,0.6)] border border-zinc-800">
              <img src="/favicon.ico" alt="icon" className="w-5 h-5 block" />
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
              CogniLine
            </h1>
            
          </div>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base hidden sm:block">
              Psychology Timeline
        </p>
        </div>
        
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-full">
            <div className="mx-auto w-full max-w-3xl relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="11"
                  cy="11"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                id="global-search"
                type="search"
                list="globalSuggestions"  // Aggiunto per attivare autocomplete
                value={query}
                onChange={handleChange}
                placeholder="Search author, year, category..."
                className="w-full py-3 sm:py-4 pl-12 pr-4 rounded-xl bg-zinc-800/50 border border-zinc-700 placeholder:text-zinc-400 text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                aria-label="Cerca nella timeline"
              />
              <datalist id="globalSuggestions">
                {[...new Set(authorsData.map(a => a.name))].map((name, i) => (
                  <option key={i} value={name} />
                ))}
                {[...new Set(authorsData.map(a => a.year))].map((year, i) => (
                  <option key={`y-${i}`} value={year} />
                ))}
                {[...new Set(authorsData.map(a => a.category || ''))].filter(cat => cat).map((cat, i) => (
                  <option key={`c-${i}`} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          {/* mobile filters removed */}
          <div className="w-full sm:hidden">{/* vuoto */}</div>
        </form>
      </div>
    </header>
  );
};

export default Header;