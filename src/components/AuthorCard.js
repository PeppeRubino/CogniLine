import React, { useState } from 'react';
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

const AuthorCard = ({ name, category, specialized, description, year, works, image, toggleHover, index }) => {
  const [isClicked, setIsClicked] = useState(false);
  const imagePath = `${process.env.PUBLIC_URL}/media/img/${image}`;
  console.log(imagePath)
  const backgroundColor = categoryColors[category];

  const handleClick = () => {
    
    setIsClicked(!isClicked);
    toggleHover(index, !isClicked, year);
  };
  return (
    <div
      className={`internal-div flex justify-evenly items-center ${category} ${isClicked ? 'clicked' : ''}`}
      onClick={handleClick}
    >
      {isClicked ? (
        /* Versione grande con tutti i dettagli */
        <div className='grid grid-flow-col gap-6 absolute top-16'>
        <div className='grid grid-flow-row shadow-zinc-500 shadow-lg rounded-md'>
          <div className='div-content-background relative grid grid-flow-col p-2  rounded-t-md bg-zinc-300' style={{minWidth:'20vw', width: '35vw',height:'35vh'}}>
              {/* First Column */}
              <div className='first-column grid-cols-1 grid grid-flow-row text-center relative overflow-y-hidden mr-2'>
                <div className="author-info grid-row-1 flex items-center justify-center text-white rounded-t-md w-full" style={{ backgroundColor }}>
                  <h3 className="text-sm font-bold whitespace-no-wrap mx-1">{name}</h3>
                </div>
                <div className="author-image grid-row-2 w-full rounded-b-md">
                  <img className="image rounded-b-md w-full" src={imagePath} alt={name}/>
                </div>
              </div>
              {/* Second Column */}
              <div className="author-works second-column text-white w-full p-2 rounded-t-md rounded-b-md grid-cols-2" style={{ backgroundColor }}>
                <h4 style={{fontSize:'0.8em'}}>Opere:</h4>
                <ul style={{fontSize:'0.7em', listStyleType:'disc'}}>
                  {works.map((work, index) => (
                    <li key={index}>{work}</li>
                  ))}
                </ul>
                <div><p style={{fontSize:'0.8em'}}>{description}</p></div>
              </div>
          </div>
                      {/* Category Section */}
                      <div className='-bottom-4 font-sm grid-flow-row w-full h-6 rounded-b-md text-white text-center' style={{ backgroundColor }}>{specialized}</div>
        </div>
                  {/* YT API */}
                  <div className='grid-cols-2 bg-gray-700' style={{ minWidth: '30vw',height:'35vh'}}><YouTubeSearchBox authorName={name} /></div>
        </div>
      ) : (
        /* Versione piccola solo con l'immagine */

        <div className="div-content-sm relative -top-28 mx-6 rounded-md shadow-zinc-800 shadow-sm hover:shadow-zinc-800 hover:shadow-lg hover:scale-105 hover:transition-shadow" style={{ height: '25vh', width: '6em', backgroundColor }}>
          <h3 className='font-sm text-white text-center rounded-t-md bg-white p-1'style={{color:backgroundColor, fontSize:'0.85em'}} >{category}</h3>
          <div className="author-image-small rounded-b-md">
            <img className='object-cover rounded-b-md p-2' style={{ height: '8em', width: '6em' }} src={imagePath} alt={name} />
          </div>
        </div>

      )}
    </div>
  );
};

export default AuthorCard;
