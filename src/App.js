import React, { useState } from 'react';
import Header from './components/Header';
import Timeline from './components/Timeline';

function App() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="App w-screen h-screen bg-gray-200 overflow-hidden relative select-none">

      <Header
        onFilterAuthor={setSelectedAuthor}
        onFilterYear={setSelectedYear}
        onSearch={setSearchQuery}       //  <<<<<<<<<<  QUI
      />

      <div className="flex-1 relative p-4 bg-slate-400 h-full cursor-default select-none">
        <Timeline
          selectedYear={selectedYear}
          selectedAuthor={selectedAuthor}
          searchQuery={searchQuery}    //  <<<<<<<<<<  PASSIAMO IL QUERY
        />
      </div>

      {/* <Footer /> */}

    </div>
  );
}

export default App;