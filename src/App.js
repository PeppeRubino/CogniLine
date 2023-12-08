import React, { useState } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Footer from './components/Footer';

function App() {
  const [selectedYear, setSelectedYear] = useState('2000');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  return (
    <div className="App w-screen h-screen bg-gray-200 overflow-hidden relative">

      {/* Sezione superiore con header e filtri */}
      <Header onFilterAuthor={setSelectedAuthor} onFilterYear={setSelectedYear} />

      {/* Sezione centrale con la Timeline */}
      <div className="flex-1 relative p-4 bg-slate-400 h-full">
        <Timeline selectedYear={selectedYear} selectedAuthor={selectedAuthor} />
      </div>

      {/* Sezione inferiore vuota */}
      <Footer className='' />

    </div>
  );
}

export default App;