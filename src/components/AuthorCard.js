import React from 'react';
import YouTubeSearchBox from './YouTubeSearchBox';

const categoryColors = {
  Neuroscienze: 'rgba(255, 0, 0, 0.5)', // Red
  Psicologia: 'rgba(0, 255, 0, 0.5)', // Green
  Medicina: 'rgba(100, 255, 100, 0.5)', // Green
  cognitivista: 'rgba(0, 0, 255, 0.5)', // Blue
  Psicoanalisi: 'rgba(255, 255, 0, 0.5)', // Yellow
  Filosofia: 'rgba(255, 0, 255, 0.5)', // Magenta
  Metafisica: 'rgba(0, 155, 255, 0.8)', // Cyan
  Sociologia: 'rgba(128, 0, 128, 0.5)', // Purple
  Pedagogia: 'rgba(255, 165, 0, 0.5)', // Orange
  Fisiologia: 'rgba(0, 128, 0, 0.5)', // Dark Green
};

const AuthorCard = ({ name, category, specialized, description, year, works, image, toggleHover, index, openAuthor, setOpenAuthor }) => {
  const isClicked = openAuthor === name;
  const imagePath = `${process.env.PUBLIC_URL}/media/img/${image}`;
  const backgroundColor = categoryColors[category];

  const handleClick = () => {
    if (isClicked) {
      // Chiudi l'immagine grande se l'autore attualmente aperto è cliccato di nuovo
      toggleHover(index, false, name);
      setOpenAuthor(null);
    } else {
      // Chiudi l'immagine grande precedente, se presente
      // Apri l'immagine grande
      toggleHover(index, true, name);
      setOpenAuthor(name);
    }
  };
  
  return (
    <div
      className={`internal-div flex justify-evenly items-center ${category}`}
      onClick={handleClick}
    >
      {isClicked ? (
        /* Versione grande con tutti i dettagli */
        <div className='grid grid-flow-col gap-3 sm:gap-6 absolute top-8 sm:top-14'>
          <div className='grid grid-flow-row gap-1 bg-zinc-300 shadow-zinc-500 shadow-lg rounded-md p-2'>
            <div className='div-content-background relative grid grid-flow-col gap-1 rounded-t-md' style={{ minWidth: '25vw', minHeight:'18vh', width: '35vw', height: '35vh' }}>
              {/* First Column */}
              <div className='hidden first-column grid-cols-1 sm:grid grid-flow-row text-center relative overflow-y-hidden mr-2'>
                <div className="author-info grid-row-1 flex items-center justify-center text-white rounded-t-md w-full" style={{ backgroundColor }}>
                  <h3 className="text-sm font-bold whitespace-no-wrap mx-1">{name}</h3>
                </div>
                <div className="author-image grid-row-2 w-full rounded-b-md">
                  <img className="image rounded-b-md w-full h-full object-contain" src={imagePath} alt={name} />
                </div>
              </div>
              {/* Second Column */}
              <div className="author-works p-2 second-column text-white w-full rounded-t-md rounded-b-md grid-cols-1" style={{ backgroundColor }}>
                <h4 style={{ fontSize: '0.8em' }}>Opere:</h4>
                <ul style={{ fontSize: '0.6em', listStyleType: 'disc' }}>
                  {works.map((work, index) => (
                    <li className='ml-4' key={index}>{work}</li>
                  ))}
                </ul>
                <hr className='my-1'></hr>
                <div><p style={{ fontSize: '0.7em' }}>{description}</p></div>
              </div>
            </div>
            {/* Category Section */}
            <div className='hidden sm:block -bottom-4 font-sm grid-flow-row w-full h-6 rounded-b-md text-white text-center' style={{ backgroundColor }}>{specialized}</div>
          </div>
          {/* YT API */}
          <div className='grid-cols-2 my-auto rounded-t-md rounded-b-md' style={{ minWidth: '30vw', height: '35vh', backgroundColor }}><YouTubeSearchBox authorName={name} /></div>
        </div>
      ) : (
        /* Versione piccola solo con l'immagine */

        <div className="div-content-sm relative -top-28 sm:mx-6 rounded-md shadow-zinc-800 shadow-sm hover:shadow-zinc-800 hover:shadow-lg hover:scale-105 hover:transition-shadow" style={{ width: '6em', backgroundColor }}>
          <h3 className='font-sm text-white text-center rounded-t-md bg-white p-1' style={{ color: backgroundColor, fontSize: '0.85em' }} >{category}</h3>
          <div className="author-image-small rounded-b-md">
            <img className='object-cover rounded-b-md p-2 relative' style={{ height: '8em', width: '6em' }} src={imagePath} alt={name} />
          </div>
        </div>

      )}
    </div>
  );
};

export default AuthorCard;
