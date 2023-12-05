import React, { useState, useEffect } from 'react';
import authorsData from '../JSON/authorsData.json';

const AuthorFilter = ({ onFilterAuthor }) => {
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const handleAuthorChange = (event) => {
    const author = event.target.value;
    setSelectedAuthor(author);
    onFilterAuthor(author);
  };
  return (
    <div className=''>
      <input
        list="authorSuggestions"
        type="text"
        id="authorFilter"
        value={selectedAuthor}
        onChange={handleAuthorChange}
        placeholder='Enter author name'
      />
      <datalist id="authorSuggestions">
        {authorsData && authorsData.map((author, index) => (
          <option key={index} value={author.name} />
        ))}
      </datalist>
    </div>
  );
};

export default AuthorFilter;
