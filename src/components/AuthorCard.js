import React, { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import YouTubeSearchBox from './YouTubeSearchBox';

/*
  Props:
    - name, category, specialized, description, year, works, image
    - toggleHover(index, bool, name)
    - index
    - openAuthor (string or null)
    - setOpenAuthor(name|null)
*/

const categoryColors = {
  Neuroscienze: 'rgba(70, 130, 180, 0.75)',
  Psicologia: 'rgba(85, 107, 47, 0.75)',
  Medicina: 'rgba(143, 188, 143, 0.75)',
  Filosofia: 'rgba(105, 105, 105, 0.75)',
  Metafisica: 'rgba(100, 149, 237, 0.75)',
  Sociologia: 'rgba(139, 0, 139, 0.7)',
  Pedagogia: 'rgba(218, 165, 32, 0.75)',
  Fisiologia: 'rgba(184, 134, 11, 0.75)',
  default: 'rgba(128, 128, 128, 0.75)',
};

const AuthorCard = ({
  name,
  category,
  specialized,
  description,
  year,
  works = [],
  image,
  toggleHover,
  index,
  openAuthor,
  setOpenAuthor,
}) => {
  const isClicked = openAuthor === name;
  const imagePath = `${process.env.PUBLIC_URL || ''}/media/img/${image}`;
  const accent = categoryColors[category] || categoryColors.default;
  const isSSR = typeof window === 'undefined';
  const isMobile = !isSSR && window.innerWidth < 640;

  const open = useCallback(
    (e) => {
      e?.stopPropagation?.();
      toggleHover(index, true, name);
      setOpenAuthor(name);
    },
    [index, name, setOpenAuthor, toggleHover]
  );

  const close = useCallback(
    (e) => {
      e?.stopPropagation?.();
      toggleHover(index, false, name);
      setOpenAuthor(null);
    },
    [index, name, setOpenAuthor, toggleHover]
  );

  // close on Esc
  useEffect(() => {
    if (!isClicked) return;
    const onKey = (ev) => {
      if (ev.key === 'Escape') close(ev);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isClicked, close]);

  // Compact thumbnail (unchanged)
  const Compact = (
    <div
      className="w-28 cursor-pointer rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-150 shadow-sm"
      onClick={open}
      title={name}
      role="button"
    >
      <div className="w-full text-center py-1" style={{ background: accent }}>
        <span className="text-white text-xs font-medium truncate block px-1">{category}</span>
      </div>

      <div className="p-2 bg-[var(--card-beige,#efe6db)]">
        <img src={imagePath} alt={name} className="w-full h-32 object-cover rounded-md" />
        <div className="mt-2 text-center">
          <div className="text-zinc-900 font-semibold text-sm truncate">{name}</div>
          <div className="text-zinc-500 text-xs">{year}</div>
        </div>
      </div>
    </div>
  );

  // Expanded card (new layout)
  const ExpandedCard = (
    <div
      className="
        relative
        w-[92vw] sm:w-[78vw] md:w-[80vw] lg:w-[70vw]
        max-w-[1000px]
        min-w-[320px]
        rounded-2xl
        shadow-[0_18px_40px_rgba(0,0,0,0.35)]
        overflow-hidden border border-zinc-300/40
        bg-white
      "
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} — dettagli`}
    >
      {/* Close X (positioned so it won't overlap main content) */}
      <button
        onClick={close}
        aria-label="Chiudi"
        className="absolute right-3 top-3 z-40 rounded-full p-1 hover:bg-zinc-100"
        style={{ background: 'transparent' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Layout: mobile-first stacked, md+ two columns
          - order on mobile: IMAGE+DETAILS (right column content), then MEDIA+WORKS (left column content)
          - md+: left column = MEDIA+WORKS, right column = IMAGE+DETAILS
      */}
      <div className="flex flex-col md:flex-row">
        {/* LEFT COLUMN on md: MEDIA + WORKS
            On mobile this appears after the IMAGE+DETAILS (so order-2 mobile, md:order-1)
        */}
        <div className="md:w-1/2 order-2 md:order-1 p-6 bg-white flex flex-col gap-6">
          {/* MEDIA */}
          <div>
            <div className="mb-2 text-zinc-700 text-sm font-semibold">Media</div>
            <div className="w-full h-44 rounded-md overflow-hidden shadow-sm">
              <YouTubeSearchBox authorName={name} />
            </div>
          </div>

          {/* WORKS */}
          <div>
            <h4 className="text-zinc-800 font-semibold text-sm mb-2">Opere</h4>
            <ul className="list-disc list-inside text-zinc-700 text-sm space-y-1 max-h-48 overflow-auto pr-2">
              {works.length > 0 ? (
                works.map((w, i) => <li key={i}>{w}</li>)
              ) : (
                <li className="text-zinc-500">Nessuna opera elencata</li>
              )}
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN on md: IMAGE + DESCRIPTIVE INFO
            On mobile this is first (order-1 mobile, md:order-2)
        */}
        <div className="md:w-1/2 order-1 md:order-2 p-6 bg-zinc-50 flex flex-col gap-4">
          {/* IMAGE (top on mobile) */}
          <div className="w-full flex items-center justify-center">
            <img
              src={imagePath}
              alt={name}
              className="w-full max-h-64 object-contain rounded-md shadow-sm"
              style={{ maxWidth: isMobile ? '92vw' : '100%' }}
            />
          </div>

          {/* Descriptive info (below image on mobile, right of image on md) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col">
                  <h3 className="text-zinc-900 font-semibold text-lg tracking-tight">{name}</h3>
                  {specialized && <div className="text-zinc-600 text-sm mt-1">{specialized}</div>}
                </div>
                <div className="inline-block rounded-md px-2 py-1 text-white text-xs font-medium self-start" style={{ background: accent }}>
                  {category}
                </div>
              </div>

              {/* Year: keep visible on all viewports; positioned to the right on md */}
              <div className="text-zinc-500 text-sm font-medium">{year}</div>
            </div>

            {/* Description + details combined */}
            <div className="text-zinc-700 text-sm leading-relaxed max-h-44 overflow-auto pr-2">
              {description}
            </div>

            {/* Additional compact details (redundant on md but useful on mobile) */}
            <div className="text-zinc-600 text-sm flex flex-col gap-1">
              {specialized && (
                <div>
                  <span className="font-semibold">Specializzazione: </span>
                  <span>{specialized}</span>
                </div>
              )}
              <div>
                <span className="font-semibold">Categoria: </span>
                <span>{category}</span>
              </div>
              <div>
                <span className="font-semibold">Anno: </span>
                <span>{year}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footnote reminder */}
      <div className="px-6 pb-6 pt-2 text-zinc-500 text-xs">Clicca fuori per chiudere o premi Esc</div>
    </div>
  );

  // If clicked -> render portal with overlay + centered card
  if (isClicked && typeof document !== 'undefined') {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* backdrop */}
        <div className="absolute inset-0 bg-black/65" onClick={close} />

        {/* centered wrapper: w-auto so card width controls itself */}
        <div className="relative z-10 px-4 py-6 w-auto flex justify-center">{ExpandedCard}</div>
      </div>,
      document.body
    );
  }

  // default compact
  return Compact;
};

export default AuthorCard;
