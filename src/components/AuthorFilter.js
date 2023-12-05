import React, { useState } from 'react';

const AuthorFilter = ({ onFilterAuthor }) => {
  const [selectedAuthor, setSelectedAuthor] = useState('');

  const handleAuthorChange = (event) => {
    const author = event.target.value;
    setSelectedAuthor(author);
    onFilterAuthor(author);
  };

  return (
    <div className='grid grid-flow-col gap-2'>
      <input
        type="text"
        id="authorFilter"
        value={selectedAuthor}
        onChange={handleAuthorChange}
        placeholder='AUTHOR es. C. G. Jung'
      />
    </div>
  );
};

export default AuthorFilter;
