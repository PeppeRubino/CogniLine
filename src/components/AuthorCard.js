// AuthorCard.js
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
  Neuroscienze: 'rgba(70, 130, 180, 0.75)',  // Blu acciaio tenue, per evocare scienza e mente
  Psicologia: 'rgba(85, 107, 47, 0.75)',     // Verde oliva muta, calmo e introspettivo
  Medicina: 'rgba(143, 188, 143, 0.75)',     // Verde salvia soft, salutare ma non vivace
  Filosofia: 'rgba(105, 105, 105, 0.75)',    // Grigio scuro classico, saggio e neutro
  Metafisica: 'rgba(100, 149, 237, 0.75)',   // Blu cornflower tenue, etereo
  Sociologia: 'rgba(139, 0, 139, 0.7)',      // Viola prugna muta, sociale e riflessivo
  Pedagogia: 'rgba(218, 165, 32, 0.75)',     // Oro antico soft, educativo e caldo
  Fisiologia: 'rgba(184, 134, 11, 0.75)',    // Giallo senape tenue, vitale ma discreto
  default: 'rgba(128, 128, 128, 0.75)',      // Grigio medio, per fallback neutro
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

  // Compact thumbnail
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

  // Expanded card (panel content)
  const ExpandedCard = (
    <div
      className="
        relative
        w-[92vw] sm:w-[75vw] md:w-[64vw] lg:w-[56vw]
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
      {/* close X (top-right) */}
      <button
        onClick={close}
        aria-label="Chiudi"
        className="absolute right-4 top-4 z-20 rounded-full p-1 hover:bg-zinc-100"
        style={{ background: 'transparent' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex flex-col md:flex-row">
        {/* LEFT */}
        <div className="md:w-1/2 p-6 flex flex-col gap-6 bg-zinc-50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-zinc-900 font-semibold text-lg tracking-tight">{name}</h3>
              {specialized && <div className="text-zinc-600 text-sm mt-1">{specialized}</div>}
            </div>
            <div className="text-zinc-500 text-sm font-medium">{year}</div>
          </div>

          <div className="w-full flex items-center justify-center">
            <img src={imagePath} alt={name} className="max-h-44 object-contain rounded-md shadow-sm" style={{ maxWidth: isMobile ? '86vw' : '100%' }} />
          </div>

          <div>
            <h4 className="text-zinc-800 font-semibold text-sm mb-2">Opere</h4>
            <ul className="list-disc list-inside text-zinc-700 text-sm space-y-1 max-h-36 overflow-auto pr-2">
              {works.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>

          <div className="mt-2 text-zinc-700 text-sm leading-relaxed max-h-36 overflow-auto pr-2">{description}</div>
        </div>

        {/* RIGHT */}
        <div className="md:w-1/2 p-6 border-t md:border-t-0 md:border-l border-zinc-200/40 bg-white">
          <div className="mb-2 text-zinc-700 text-sm font-semibold">Media</div>
          <div className="w-full h-44 rounded-md overflow-hidden shadow-sm">
            <YouTubeSearchBox authorName={name} />
          </div>

          <div className="mt-4">
            <div className="inline-block rounded-md px-3 py-2 text-white text-xs font-medium" style={{ background: accent }}>
              {category}
            </div>
          </div>
        </div>
      </div>
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
