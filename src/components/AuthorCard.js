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
    - anchorY (optional number: absolute document Y where the timeline sits)
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
  anchorY = 0,
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

  // Expanded card (layout: right = image+details, left = media+works on md; mobile stacks image -> details -> media -> works)
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
      // Ensure the inner card can scroll its content if needed
      style={{ maxHeight: 'calc(100vh - 40px)', overflow: 'hidden' }}
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

      {/* Layout */}
      <div className="flex flex-col md:flex-row h-full">
        {/* LEFT COLUMN on md: MEDIA + WORKS (order-2 on mobile) */}
        <div className="md:w-1/2 order-2 md:order-1 p-6 bg-white flex flex-col gap-6 overflow-auto">
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

        {/* RIGHT COLUMN on md: IMAGE + DESCRIPTIVE INFO (order-1 on mobile) */}
        <div className="md:w-1/2 order-1 md:order-2 p-6 bg-zinc-50 flex flex-col gap-4 overflow-auto">
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

              {/* Year */}
              <div className="text-zinc-500 text-sm font-medium">{year}</div>
            </div>

            {/* Description + details */}
            <div className="text-zinc-700 text-sm leading-relaxed max-h-44 overflow-auto pr-2">
              {description}
            </div>

            {/* Additional compact details */}
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

  // If clicked -> render portal with overlay + wrapper posizionato rispetto ad anchorY
  if (isClicked && typeof document !== 'undefined') {
    // Decide positioning: mobile -> align to top (under timeline) and allow scroll;
    // desktop -> center vertically.
    let outerStyle = {
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      // default center
      alignItems: 'center',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    };

    let innerWrapperStyle = {
      // this wrapper constrains the ExpandedCard and enables internal scrolling if needed
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      boxSizing: 'border-box',
      paddingLeft: '16px',
      paddingRight: '16px',
      paddingBottom: '24px',
      paddingTop: '24px',
    };

    if (isMobile) {
      // on mobile position under timeline using anchorY -> convert to viewport offset
      try {
        const viewportOffset = Math.max(anchorY - window.scrollY, 0);
        // add a small offset so card doesn't overlap the line exactly
        const paddingTopPx = Math.max(viewportOffset + 12, 8);
        outerStyle.alignItems = 'flex-start';
        outerStyle.paddingTop = `${paddingTopPx}px`;
        // ensure outer allows scrolling if content is taller than viewport
        outerStyle.overflowY = 'auto';
        innerWrapperStyle.paddingTop = '8px';
        // container that holds the ExpandedCard must allow vertical scrolling within viewport
      } catch (e) {
        // fallback: keep alignItems flex-start
        outerStyle.alignItems = 'flex-start';
        outerStyle.paddingTop = '12px';
      }
    } else {
      // desktop: ensure centered and no large top padding
      outerStyle.alignItems = 'center';
      outerStyle.paddingTop = '0px';
    }

    // ensure the content wrapper enforces max height and scroll
    const contentContainerStyle = {
      maxHeight: 'calc(100vh - 40px)',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    };

    return createPortal(
      <div style={outerStyle}>
        {/* backdrop */}
        <div className="absolute inset-0 bg-black/65" onClick={close} />

        {/* inner wrapper provides side padding + vertical constraints */}
        <div style={innerWrapperStyle} className="relative z-10">
          <div style={contentContainerStyle}>
            {ExpandedCard}
          </div>
        </div>
      </div>,
      document.body
    );
  }

  // default compact
  return Compact;
};

export default AuthorCard;
