import React, { useState} from 'react';
import Timeline from './components/Timeline';
import Header from './components/Header';

function App() {
  const [selectedYear, setSelectedYear] = useState('2000');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  return (
    <div className="App w-screen h-screen bg-gray-200 overflow-hidden relative">

      {/* Sezione superiore con header e filtri */}
      <Header onFilterAuthor={setSelectedAuthor} onFilterYear={setSelectedYear} />

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