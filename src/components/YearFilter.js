import React, { useState } from 'react';

const YearFilter = ({ onFilterYear }) => {
  const [selectedYear, setSelectedYear] = useState('');

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    onFilterYear(year);
  };

  return (
    <div className='grid grid-flow-col gap-2'>
      <input
        type="number"
        id="yearFilter"
        value={selectedYear}
        onChange={handleYearChange}
        placeholder='YEAR es. -100'
      />
    </div>
  );
};

export default YearFilter;
