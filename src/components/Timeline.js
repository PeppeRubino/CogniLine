import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import AuthorCard from "./AuthorCard.js";
import authorsData from "../data/authorsData.json";
import "../App.css";

const Timeline = ({ selectedYear, selectedAuthor, searchQuery }) => {
  // Constants for configuration
  const TICK_DISTANCE = 18;
  const START_YEAR = -3000;
  const YEAR_INTERVAL = 1;
  const SPECIAL_TICK_INTERVAL = 100;

  // Refs
  const timelineRef = useRef(null);
  const timelineContainerRef = useRef(null); // <--- nuovo ref per container timeline

  // State variables
  const [DRAG_START_X, setDragStartX] = useState(null);
  const [SCROLL_X, setScrollX] = useState(0);
  const START_YEAR_STATE = START_YEAR; // unchanged
  const [CLICKED_YEAR, setClickedYear] = useState(null);
  const [TOTAL_TICKS, setTotalTicks] = useState(0);
  const [TODAY_TICK, setTodayTick] = useState(0);
  const [HOVERED_YEAR, setHoveredYear] = useState(null);
  const [openAuthor, setOpenAuthor] = useState(null);

  // Mobile hint
  const [showMobileHint, setShowMobileHint] = useState(true);

  // Window width reattivo
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // <-- NEW: timeline top (distanza dal top della pagina, in px)
  const [timelineTop, setTimelineTop] = useState(0);

  // Calcola autori filtrati
  const filteredAuthors = useMemo(() => {
    let list = authorsData;

    if (selectedAuthor && selectedAuthor.trim() !== "") {
      list = list.filter(
        (a) => a.name.toLowerCase() === selectedAuthor.toLowerCase()
      );
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const isNumericQuery = !isNaN(q) && q !== "";

      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.category && a.category.toLowerCase().includes(q)) ||
          (isNumericQuery && String(a.year).startsWith(q))
      );
    }

    return list;
  }, [selectedAuthor, searchQuery]);

  // Usa filteredAuthors per autori per anno
  const filterAuthorsForYear = (years) => {
    return filteredAuthors.filter((author) => author.year === years);
  };

  const handleTickClick = useCallback((years) => {
    setClickedYear((prevYear) => (prevYear === years ? null : years));
  }, []);

  // toggleHover: helper che AuthorCard può chiamare
  const toggleHover = useCallback((index, isOpen, name) => {
    if (isOpen) {
      setOpenAuthor(name);
    } else {
      setOpenAuthor(null);
    }
  }, []);

  // Usa filterAuthorsForYear (filtrato)
  const isTickVisible = (years) => {
    return filterAuthorsForYear(years).length > 0;
  };

  // Calcola numero totale di tick
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsDifference = currentYear - START_YEAR_STATE;
    const totalTicks = Math.ceil(yearsDifference / YEAR_INTERVAL);
    setTotalTicks(totalTicks);
  }, [START_YEAR_STATE, YEAR_INTERVAL]);

  // Calcola il tick odierno e scroll iniziale (dipende da windowWidth)
  useEffect(() => {
    const today = new Date().getFullYear();
    const tick = Math.floor((today - START_YEAR_STATE) / YEAR_INTERVAL);
    setTodayTick(tick);
    setScrollX(-tick * TICK_DISTANCE + windowWidth / 2);
  }, [START_YEAR_STATE, YEAR_INTERVAL, TICK_DISTANCE, windowWidth]);

  // Gestisci scrolling e apertura card su cambio searchQuery
  useEffect(() => {
    const qTrim = searchQuery.trim();
    if (qTrim !== "") {
      const matchingYears = [
        ...new Set(filteredAuthors.map((a) => a.year)),
      ].sort((a, b) => a - b);
      if (matchingYears.length > 0) {
        let targetYear = matchingYears[0];
        const q = qTrim.toLowerCase();
        const isNumericQuery = !isNaN(q);

        if (!isNumericQuery) {
          const exactMatch = filteredAuthors.find(
            (a) => a.name.toLowerCase() === q
          );
          if (exactMatch) {
            targetYear = exactMatch.year;
          } else {
            const startMatches = filteredAuthors.filter((a) =>
              a.name.toLowerCase().startsWith(q)
            );
            if (startMatches.length > 0) {
              targetYear = startMatches.sort((a, b) => a.year - b.year)[0].year;
            }
          }
        }

        const yearIndex = Math.floor(
          (targetYear - START_YEAR_STATE) / YEAR_INTERVAL
        );
        setScrollX(-yearIndex * TICK_DISTANCE + windowWidth / 2);
        setClickedYear(targetYear);
      }
    } else {
      // Reset a today se query vuota
      setScrollX(-TODAY_TICK * TICK_DISTANCE + windowWidth / 2);
      setClickedYear(null);
    }
  }, [
    searchQuery,
    filteredAuthors,
    START_YEAR_STATE,
    YEAR_INTERVAL,
    windowWidth,
    TODAY_TICK,
    TICK_DISTANCE,
  ]);

  // Handle mouse events per drag timeline
  const handleMouseEnter = useCallback(() => {
    if (timelineRef.current) timelineRef.current.style.cursor = "grab";
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      if (DRAG_START_X !== null) {
        const delta = event.clientX - DRAG_START_X;
        setScrollX((prevScrollX) => prevScrollX + delta);
        setDragStartX(event.clientX);
        if (timelineRef.current) timelineRef.current.style.cursor = "grabbing";
      }
    },
    [DRAG_START_X]
  );

  const handleMouseUp = useCallback(() => {
    setDragStartX(null);
    if (timelineRef.current) timelineRef.current.style.cursor = "grab";
  }, []);

  const handleMouseWheel = useCallback((event) => {
    const delta = event.deltaX || event.deltaY;
    setScrollX((prevScrollX) => prevScrollX + delta * 1.5);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("wheel", handleMouseWheel, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("wheel", handleMouseWheel);
    };
  }, [handleMouseMove, handleMouseUp, handleMouseWheel]);

  // unified touch start that also hides the mobile hint
  const handleTouchStart = useCallback((event) => {
    if (event?.touches && event.touches[0]) {
      setDragStartX(event.touches[0].clientX);
      setShowMobileHint(false); // nasconde l'hint alla prima interazione touch
    }
  }, []);

  const handleTouchMove = useCallback(
    (event) => {
      if (DRAG_START_X !== null && event?.touches && event.touches[0]) {
        const delta = event.touches[0].clientX - DRAG_START_X;
        setScrollX((prevScrollX) => prevScrollX + delta);
        setDragStartX(event.touches[0].clientX);
      }
    },
    [DRAG_START_X]
  );

  const handleTouchEnd = useCallback(() => {
    setDragStartX(null);
  }, []);

  useEffect(() => {
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // window resize listener per windowWidth
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // <-- NEW: calcola timelineTop (aggiorna anche on resize/scroll)
  useEffect(() => {
    const computeTop = () => {
      try {
        if (timelineContainerRef.current) {
          const rect = timelineContainerRef.current.getBoundingClientRect();
          // top relativo al documento (perché il portal è in body)
          setTimelineTop(rect.top + window.scrollY);
        }
      } catch (e) {
        // fallback innocuo
        setTimelineTop(0);
      }
    };

    computeTop();
    window.addEventListener("resize", computeTop);
    window.addEventListener("scroll", computeTop, { passive: true });
    return () => {
      window.removeEventListener("resize", computeTop);
      window.removeEventListener("scroll", computeTop);
    };
  }, []);

  // Authors for currently clicked year (used per center floating cards)
  const centerAuthors =
    CLICKED_YEAR !== null ? filterAuthorsForYear(CLICKED_YEAR) : [];

  return (
    <div className="relative w-full flex justify-center items-start pt-24 mt-14 pb-10">
      {/* Decorative hero area */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-zinc-900 to-zinc-800 opacity-80" />

      <div className="w-full max-w-6xl px-4 md:px-6 lg:px-8 relative">
        {/* Floating center cards */}
        <div className="relative">
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-28 z-40 flex items-end gap-6 pointer-events-none"
            aria-hidden
          >
            {centerAuthors.length > 0 ? (
              centerAuthors.map((author, i) => (
                <div key={i} className="pointer-events-auto select-none">
                  {/* Passiamo anchorY (= timelineTop) ad AuthorCard */}
                  <AuthorCard
                    name={author.name}
                    category={author.category}
                    specialized={author.specialized}
                    description={author.description}
                    year={author.year}
                    works={author.works}
                    image={author.image}
                    toggleHover={toggleHover}
                    index={i}
                    openAuthor={openAuthor}
                    setOpenAuthor={setOpenAuthor}
                    anchorY={timelineTop} // <-- nuovo prop
                  />
                </div>
              ))
            ) : (
              <div className="h-8" />
            )}
          </div>
        </div>

        {/* Central marker */}
        <div className="absolute left-1/2 -translate-x-1/2 top-28 z-50 flex flex-col items-center">
          <div
            className="w-5 h-5 rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
            aria-hidden
          />
          <div className="mt-3 text-zinc-400 text-sm">{CLICKED_YEAR ?? ""}</div>
        </div>

        {/* Timeline container (attach ref for top calculation) */}
        <div
          ref={timelineContainerRef}
          className="relative mt-20 h-24 flex items-center"
        >
          {/* baseline line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-zinc-700 rounded-full z-10" />

          {/* ticks wrapper */}
          <div
            ref={timelineRef}
            onMouseEnter={handleMouseEnter}
            onMouseDown={(e) => {
              handleMouseEnter();
              setDragStartX(e.clientX);
              setShowMobileHint(false);
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleMouseWheel}
            className="relative h-24 z-20 select-none"
            style={{
              width: `${TOTAL_TICKS * TICK_DISTANCE}px`,
              transform: `translateX(${SCROLL_X}px)`,
              transition:
                DRAG_START_X === null ? "transform 0.12s ease-out" : "none",
            }}
          >
            {/* Today's vertical marker */}
            <div
              className="absolute"
              style={{
                left: `${TODAY_TICK * TICK_DISTANCE}px`,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <div className="w-1.5 h-8 bg-zinc-600 rounded" />
            </div>

            {/* Render ticks */}
            {Array.from({ length: TOTAL_TICKS + 1 }).map((_, index) => {
              const years = START_YEAR_STATE + index * YEAR_INTERVAL;
              const leftPx = index * TICK_DISTANCE;
              const isEvent = isTickVisible(years);
              const isSpecial =
                index % SPECIAL_TICK_INTERVAL === 0 && index <= TODAY_TICK;

              if (!isEvent && !isSpecial) return null;

              return (
                <React.Fragment key={index}>
                  <div
                    style={{
                      left: `${leftPx}px`,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                    className={`absolute flex flex-col items-center ${
                      isEvent ? "cursor-pointer" : ""
                    }`}
                    onClick={isEvent ? () => handleTickClick(years) : null}
                    onMouseEnter={isEvent ? () => setHoveredYear(years) : null}
                    role={isEvent ? "button" : null}
                    tabIndex={isEvent ? 0 : null}
                    aria-label={isEvent ? `Tick ${years}` : null}
                    onKeyDown={
                      isEvent
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ")
                              handleTickClick(years);
                          }
                        : null
                    }
                  >
                    {/* tick line */}
                    <div
                      className={`${
                        isSpecial ? "w-[3px]" : "w-[2px]"
                      } ${
                        isEvent && CLICKED_YEAR === years
                          ? "h-10 bg-white"
                          : isSpecial
                          ? "h-8 bg-zinc-600"
                          : "h-6 bg-zinc-500"
                      } rounded`}
                    />

                    {/* small hover label */}
                    {isEvent && HOVERED_YEAR === years && (
                      <div className="absolute -top-12 text-xs text-zinc-300 bg-zinc-800/60 px-2 py-1 rounded">
                        {years}
                      </div>
                    )}

                    {/* year label */}
                    <div
                      className="mt-2 text-zinc-400 text-xs select-none"
                      style={{ marginTop: 10 }}
                    >
                      {years}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Mobile-only hint */}
        {showMobileHint && (
          <div className="md:hidden mt-4 flex justify-center">
            <div className="text-center px-3 py-2 rounded-full bg-zinc-900/70 backdrop-blur text-sm text-zinc-200 select-none animate-slide">
              Scorri a sinistra o a destra
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
