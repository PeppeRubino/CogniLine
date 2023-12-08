import React, { useState} from 'react';
import Timeline from './components/Timeline';
import AuthorFilter from './components/AuthorFilter.js';
import YearFilter from './components/YearFilter.js';

function App() {
  const [selectedYear, setSelectedYear] = useState('2000');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  return (
    <div className="App w-screen h-screen bg-gray-200 overflow-hidden relative">

      {/* Sezione superiore con header e filtri */}
      <div className="flex-shrink-0  relative sm:p-4 bg-zinc-800 text-center  sm:flex sm:justify-around sm:items-center w-screen sm:h-18">
        {/* Aggiungi il tuo header con filtri qui */}
        <div className='w-full sm:h-full h-16 flex items-center justify-center sm:justify-start'><img className='w-5 h-5' src='/favicon.ico' alt='icon'/>
        <h2 className="text-white text-2xl font-bold ml-2">Chronos</h2>
        </div>
        {/* Aggiungi i tuoi filtri qui */}
        <div className='h-16 sm:h-full'>
        <AuthorFilter onFilterAuthor={setSelectedAuthor}/>
        <YearFilter onFilterYear={setSelectedYear} />
        </div>
      </div>

      {/* Sezione centrale con la Timeline */}
      <div className="flex-1 relative p-4 bg-slate-400 h-full">
      <Timeline selectedYear={selectedYear} selectedAuthor={selectedAuthor}/>
      </div>

      {/* Sezione inferiore vuota */}
      <div className="w-screen p-1 h-7 bg-zinc-800 bottom-0 absolute sm:absolute text-center text-white" style={{fontSize:'0.8em'}} >
        <p>Made by Giuseppe Rubino for benefit of all.</p>
      </div>
    </div>
  );
}

export default App;