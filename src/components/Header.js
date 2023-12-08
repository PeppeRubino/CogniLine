// Header.js
import React from 'react';
import AuthorFilter from './AuthorFilter';
import YearFilter from './YearFilter';

const Header = ({ onFilterAuthor, onFilterYear }) => {
  return (
    <div className="flex-shrink-0 relative sm:p-4 bg-zinc-800 text-center sm:flex sm:justify-around sm:items-center w-screen sm:h-18">
      {/* Aggiungi il tuo header con filtri qui */}
      <div className='w-full sm:h-full h-16 flex items-center justify-center sm:justify-start'>
        <img className='w-5 h-5' src='/favicon.ico' alt='icon'/>
        <h2 className="text-white text-2xl font-bold ml-2">Chronos</h2>
      </div>
      {/* Aggiungi i tuoi filtri qui */}
      <div className='h-16 sm:h-full'>
        <AuthorFilter onFilterAuthor={onFilterAuthor} />
        <YearFilter onFilterYear={onFilterYear} />
      </div>
    </div>
  );
};

export default Header;
