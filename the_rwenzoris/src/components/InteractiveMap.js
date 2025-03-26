'use client';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';


// dynamically importing react-leaflet components to prevent ssr issues
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {ssr: false,});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {ssr: false,});
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), {ssr: false,});
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {ssr: false,});

const InteractiveMap = () => {
  const rwenzoriPosition = [0.3667, 29.9667]; // Rwenzori Mountains coordinates

  return (
    <MapContainer center={rwenzoriPosition} zoom={8} className="h-96 w-full rounded-lg shadow-md">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={rwenzoriPosition}>
        <Popup> 
          <strong>Rwenzori Mountains</strong>
          <br />
          The &quot;Mountains of the Moon.&quot;
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default InteractiveMap;
