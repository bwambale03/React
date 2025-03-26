'use client';

import { useState } from 'react';
import DestinationCards from '../../components/DestinationCards';
import SearchFilter from '../../components/SearchFilter';
import destinations from '../../data/destinations.json';

type Destination = {
  id: number;
  name: string;
  location: string;
  image: string;
  tags?: string[]; // Made tags optional to match the data structure
};

type Filter = {
  filter: string;
};

export default function DestinationsPage() {
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>(destinations);

  const handleFilter = (filter: Filter['filter']): void => {
    const filtered = destinations.filter((destination: Destination) =>
      filter === 'all' ? true : destination.tags?.includes(filter) ?? false
    );
    setFilteredDestinations(filtered);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Destinations</h1>
      <SearchFilter onFilter={handleFilter} onSearch={() => {}} />
      <DestinationCards destinations={filteredDestinations} />
    </div>
  );
}
