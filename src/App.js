import React, { useState} from 'react';
import Timeline from './components/Timeline';
import AuthorFilter from './components/AuthorFilter.js';
import YearFilter from './components/YearFilter.js';

function App() {
  const [selectedYear, setSelectedYear] = useState('2000');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  return (
    <div className="App w-screen h-screen flex flex-col bg-gray-200 overflow-hidden">

      {/* Sezione superiore con header e filtri */}
      <div className="flex-shrink-0 p-4 bg-zinc-800 flex ">
        {/* Aggiungi il tuo header con filtri qui */}
        <h2 className="text-white text-2xl font-bold mr-5 ">LinearAPP</h2>
        {/* Aggiungi i tuoi filtri qui */}
        <div className='bg-blue-900'>
        <AuthorFilter onFilterAuthor={setSelectedAuthor}/>
        <YearFilter onFilterYear={setSelectedYear} />
        </div>
      </div>

      {/* Sezione centrale con la Timeline */}
      <div className="flex-1 p-4 bg-slate-400">
      <Timeline selectedYear={selectedYear} selectedAuthor={selectedAuthor}/>
      </div>

      {/* Sezione inferiore vuota */}
      <div className="flex-shrink-0 p-2 bg-zinc-800">
        {/* Puoi aggiungere contenuti o informazioni qui in un secondo momento */}
      </div>
    </div>
  );
}

export default App;