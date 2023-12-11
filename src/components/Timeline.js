import React, { useState, useRef, useEffect, useCallback } from 'react';
import AuthorCard from './AuthorCard.js';
import authorsData from '../JSON/authorsData.json';
import '../App.css';

const Timeline = ({ selectedYear, selectedAuthor }) => {
  // Constants for configuration
  const TICK_DISTANCE = 18;
  const START_YEAR = -3000;
  const YEAR_INTERVAL = 1;
  const SPECIAL_TICK_INTERVAL = 100;
  const WINDOW_WIDTH = window.innerWidth;

  // Ref for the timeline
  const timelineRef = useRef(null);

  // State variables
  const [DRAG_START_X, setDragStartX] = useState(null);
  const [SCROLL_X, setScrollX] = useState(0);
  const START_YEAR_STATE = START_YEAR; // Removed array dependency
  const [CLICKED_YEAR, setClickedYear] = useState(null);
  const [TOTAL_TICKS, setTotalTicks] = useState(0);
  const [TODAY_TICK, setTodayTick] = useState(0);
  const [HOVERED_YEAR, setHoveredYear] = useState(null);
  const [openAuthor, setOpenAuthor] = useState(null);


  // Function to filter authors for a specific year
  const filterAuthorsForYear = (years) =>
    authorsData.filter((author) => author.year === years);

    const handleTickClick = useCallback((years) => {
      setClickedYear((prevYear) => (prevYear === years ? null : years));
    }, []);

  // Function to determine the visibility of the tick based on the presence of authors
  const isTickVisible = (years) => {
    const authorsForYear = filterAuthorsForYear(years);
    return authorsForYear.length > 0;
  };

  // Calculate the total number of ticks
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearsDifference = currentYear - START_YEAR_STATE;
    const totalTicks = Math.ceil(yearsDifference / YEAR_INTERVAL);
    setTotalTicks(totalTicks);
  }, [START_YEAR_STATE, YEAR_INTERVAL]);
  
  // Handle the selected year
  useEffect(() => {
    if (selectedYear !== null) {
      const yearIndex = Math.floor((selectedYear - START_YEAR_STATE) / YEAR_INTERVAL);
      setScrollX(-yearIndex * TICK_DISTANCE + (WINDOW_WIDTH / 2));
    }
  }, [selectedYear, START_YEAR_STATE, YEAR_INTERVAL, WINDOW_WIDTH]);

// Handle the selected author
useEffect(() => {
  if (selectedAuthor !== null) {
    const author = authorsData.find((author) => author.name === selectedAuthor);
    if (author && author.year !== undefined) {
      const authorYearIndex = Math.floor((author.year - START_YEAR_STATE) / YEAR_INTERVAL);
      setScrollX(-authorYearIndex * TICK_DISTANCE + (WINDOW_WIDTH / 2));
      // Call  function directly with the author's year index
      handleTickClick(author.year);
    }
  }
}, [selectedAuthor, START_YEAR_STATE, handleTickClick, WINDOW_WIDTH]);


  // Calculate the current year and set today's tick
  useEffect(() => {
    const today = new Date().getFullYear();
    setTodayTick(Math.floor(today - START_YEAR_STATE));
  }, [START_YEAR_STATE, YEAR_INTERVAL]);

  // Handle mouse events for dragging the timeline
  const handleMouseEnter = useCallback(() => {
    timelineRef.current.style.cursor = 'grab';
  }, []);

  const handleMouseMove = useCallback((event) => {
    if (DRAG_START_X !== null) {
      const delta = event.clientX - DRAG_START_X;
      setScrollX((prevScrollX) => prevScrollX + delta);
      setDragStartX(event.clientX);
      timelineRef.current.style.cursor = 'grabbing';
    }
  }, [DRAG_START_X]);

  const handleMouseUp = useCallback(() => {
    setDragStartX(null);
    timelineRef.current.style.cursor = 'grab';
  }, []);

  const handleMouseWheel = useCallback((event) => {
    const delta = event.deltaX || event.deltaY;
    setScrollX((prevScrollX) => prevScrollX + delta * 1.5);
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('wheel', handleMouseWheel, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('wheel', handleMouseWheel);
    };
  }, [handleMouseMove, handleMouseUp, handleMouseWheel, START_YEAR_STATE]);
  const handleTouchStart = useCallback((event) => {
    setDragStartX(event.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((event) => {
    if (DRAG_START_X !== null) {
      const delta = event.touches[0].clientX - DRAG_START_X;
      setScrollX((prevScrollX) => prevScrollX + delta);
      setDragStartX(event.touches[0].clientX);
    }
  }, [DRAG_START_X]);

  const handleTouchEnd = useCallback(() => {
    setDragStartX(null);
  }, []);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, START_YEAR_STATE]);

  return (
    <div className="flex-raw items-center overflow-x-visible select-none" style={{marginTop:'30vh'}}>
      {/* Timeline */}
      <div
        className="timeline timeline-line bg-white shadow-md h-5 rounded-md z-30"
        onMouseEnter={handleMouseEnter}
        onMouseDown={(e) => {
          handleMouseEnter();
          setDragStartX(e.clientX);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleMouseWheel}
        ref={timelineRef}
        style={{ width: `${TOTAL_TICKS * TICK_DISTANCE}px`, transform: `translateX(${SCROLL_X}px)` }}

      >
        {/* Today's timeline start */}
        <div
          className="timeline-today absolute -mt-2 right-2 overflow-y-visible h-4 w-1 bg-red-500 cursor-pointer z-10"
        ></div>

        {/* Timeline ticks */}
        {Array.from({ length: 10000 }).map((_, index) => {
          const years = START_YEAR_STATE + index * YEAR_INTERVAL;
          const tickStyle = { left: `${index * TICK_DISTANCE}px` };
          const isVisible = isTickVisible(years);
          const authorsForYear = filterAuthorsForYear(years);

          return (
            <React.Fragment key={index}>
              {isVisible && (
                <div
                  className={`timeline-tick absolute h-3 w-1 p-1 cursor-pointer text-gray-600 ${CLICKED_YEAR === years ? 'bg-blue-500' : 'bg-gray-600'}`}
                  style={{ ...tickStyle, top: 0 }}
                  onClick={() => handleTickClick(years)}
                  onMouseEnter={() => setHoveredYear(years)}
                >
                  {HOVERED_YEAR === years && <h5 className='absolute -top-5 font-thin'>{years}</h5>}
                  {CLICKED_YEAR === years && (
                    <div className={`external-div flex items-center relative w-full h-full`}>
                      {authorsForYear.map((author, authorIndex) => (
                        <AuthorCard
                          key={authorIndex}
                          {...author}
                          isClicked={CLICKED_YEAR === years}
                          toggleHover={() => handleTickClick(years)}
                          openAuthor={openAuthor}  // Passa openAuthor come prop
                        setOpenAuthor={setOpenAuthor} 
                        authorName={author.name}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Display a "special tick" every 100 years */}
              {index % SPECIAL_TICK_INTERVAL === 0 && index <= TODAY_TICK && (
                <div
                  className="timeline-tick-hundredth -top-2 w-3 h-5 absolute overflow-visible bg-green-600"
                  style={{ left: `${(years - START_YEAR_STATE) / YEAR_INTERVAL * TICK_DISTANCE}px` }}
                >
                  <h3 className='absolute -top-6 -left-2 bg-white rounded-md p-1' style={{ fontSize: '9px' }}>{years}</h3>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
