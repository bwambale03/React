import { useState } from 'react';

const SearchFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    onFilter(e.target.value);
  };

  return (
    <div className="flex gap-4 p-4 bg-gray-100 rounded-lg">
      <input
        type="text"
        placeholder="Search destinations..."
        value={searchTerm}
        onChange={handleSearch}
        className="flex-1 p-2 border border-gray-300 rounded-lg"
      />
      <select
        value={filter}
        onChange={handleFilter}
        className="p-2 border border-gray-300 rounded-lg"
      >
        <option value="all">All</option>
        <option value="mountain">Mountain</option>
        <option value="forest">Forest</option>
        <option value="wildlife">Wildlife</option>
      </select>
    </div>
  );
};

export default SearchFilter;
