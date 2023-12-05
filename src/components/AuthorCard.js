import React, { useState } from 'react';

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
  const imagePath = `${process.env.PUBLIC_URL}./media/img/${image}`;
  console.log(imagePath)
  const backgroundColor = categoryColors[category];

  const handleClick = () => {
    setIsClicked(!isClicked);
    toggleHover(index, !isClicked, year);
  };

  return (
    <div
      className={`timeline-content-sm w-full h-full relative ${category} ${isClicked ? 'clicked' : ''}`}
      onClick={handleClick}
      style={{ left: '-50%' }}
    >
      {isClicked ? (
        /* Versione grande con tutti i dettagli */
        <div className='absolute'>
          <div className='div-content-background relative p-3 shadow-zinc-500 shadow-lg rounded-t-md rounded-b-md bg-zinc-300' style={{ width: '30vw',height:'100%', top:'13em', left:'-50%'}}>
            <div className="div-content-big grid grid-cols-2 gap-3 rounded-t-md content-center object-contain relative">
              {/* First Column */}
              <div className='first-column block text-center'>
                <div className="author-info flex items-center justify-center text-white rounded-t-md" style={{ backgroundColor }}>
                  <h3 className="text-sm font-bold whitespace-no-wrap">{name}</h3>
                  <p className='ml-1 whitespace-no-wrap'>{`(${year}y.)`}</p>
                </div>
                <div className="author-image bg-white w-full overflow-y-hidden" style={{ height: '30vh' }}>
                  <img src={imagePath} alt={name} />
                </div>
              </div>
              {/* Second Column */}
              <div className="author-works text-white w-full p-2 rounded-t-md" style={{ backgroundColor }}>
                <h4 style={{fontSize:'11px'}}>Opere:</h4>
                <nl style={{fontSize:'9px'}}>
                  {works.map((work, index) => (
                    <li key={index}>{work}</li>
                  ))}
                </nl>
                <div><p style={{fontSize:'12px', marginTop:'1em'}}>{description}</p></div>
              </div>
            </div>
            {/* Category Section */}
            <div className='block font-sm col-span-2 w-full h-6 rounded-b-md text-white text-center mt-2' style={{ backgroundColor }}>{specialized}</div>
          </div>
        </div>
      ) : (
        /* Versione piccola solo con l'immagine */
        
        <div className="div-content-sm rounded-md shadow-zinc-700 shadow-md hover:shadow-white hover:scale-105 hover:transition-shadow" style={{ height: '100%', width: '6em', backgroundColor, top:'-1vh'  }}>
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
