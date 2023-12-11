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
  const isMobile = window.innerWidth < 637;

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
      className={`internal-div ${isClicked ? 'clicked absolute -top-3 sm:top-0 z-50' : 'relative mx-4'} ${category}`}
      style={isClicked ? { transform: 'translate(-50%, 5vh)' } : { transform: 'translate(-65%,-18vh)' }}
    >
      {isClicked ? (
        /* Versione grande con tutti i dettagli */
        <div className='sm:grid sm:grid-flow-col sm:cols-auto sm:gap-6'>
          <div className=' flex items-center justify-around p-2 sm:grid sm:grid-flow-row bg-zinc-300 shadow-zinc-500 shadow-lg rounded-md ' style={ isMobile ? {width: "90vw", height: "28vh", position:"relative", top:"-35vh"} : {width: "30vw", height: "100%"}}>
            <div className='div-content-background grid grid-flow-col gap-1 rounded-t-md relative h-full' style={ isMobile ? {width: "100%"} : {width: "100%"}} onClick={handleClick}>
              {/* First Column */}
              <div className=' first-column grid-cols-1 grid grid-flow-row text-center relative overflow-y-hidden mr-2' >
                <div className="author-name sm:grid-row-1 h-full text-white rounded-t-md p-2 sm:p-0" style={{display:"block", backgroundColor}}>
                  <h3 className=" text-sm font-bold whitespace-no-wrap mx-1" >{name}</h3>
                </div>
                <div className="author-image sm:grid-row-2 rounded-b-md">
                  <img className="image rounded-b-md w-full object-contain" src={imagePath} alt={name} />
                </div>
              </div>
              {/* Second Column */}
              <div className="author-works p-1 second-column text-white w-full rounded-t-md rounded-b-md sm:grid-cols-2 object-contain h-full" style={{ backgroundColor }}>
                <h4 style={ isMobile ? { fontSize: '0.6em' } : {fontSize: '0.9em'}}>Opere:</h4>
                <ul style={ isMobile ? { fontSize: '0.6em', listStyleType:'disc' } : {fontSize: '0.6em', listStyleType:'disc'}}>
                  {works.map((work, index) => (
                    <li className='ml-4' key={index}>{work}</li>
                  ))}
                </ul>
                <hr className='my-1'></hr>
                <div className='overflow-y-hidden'><p style={ isMobile ? { fontSize: '0.6em' } : {fontSize: '0.7em'}} className='h-full'>{description}</p></div>
              </div>
            </div>
            {/* Category Section */}
            <div className='hidden sm:block font-sm grid-flow-row w-full rounded-b-md text-white text-center py-1' style={ isMobile ? { display:"none" } : {fontSize: '0.8em', display:"block", backgroundColor, marginTop:"1vh"}}>{specialized}</div>
          </div>
          {/* YT API */}
          <div className='grid-cols-2 my-auto rounded-t-md rounded-b-md' style={ isMobile ? {width: "90vw", height: "27vh", backgroundColor, top:"2vh", position:"absolute"} : {width: "40vw", height: "35vh", backgroundColor}}><YouTubeSearchBox authorName={name} /></div>
        </div>
      ) : (
        /* Versione piccola solo con l'immagine */

        <div className="div-content-sm rounded-md shadow-zinc-800 shadow-sm hover:shadow-zinc-800 hover:shadow-lg hover:scale-105 hover:transition-shadow w-24" style={{ backgroundColor }} onClick={handleClick}>
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
