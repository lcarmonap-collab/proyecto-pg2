'use client';

import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { env } from '@/lib/env';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const markerIcon = L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] });

function MapClick({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (event) => onSelect(event.latlng.lat, event.latlng.lng) });
  return null;
}

export function ParcelMap({ lat, lng, onSelect }: { lat?: number; lng?: number; onSelect: (lat: number, lng: number) => void }) {
  const position: LatLngExpression = [lat ?? env.mapLat, lng ?? env.mapLng];
  return <MapContainer center={position} zoom={lat && lng ? 15 : env.mapZoom} scrollWheelZoom className="rounded-xl">
    <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <MapClick onSelect={onSelect} />
    {lat !== undefined && lng !== undefined && <Marker position={[lat, lng]} icon={markerIcon}><Popup>Ubicación seleccionada<br />Lat: {lat.toFixed(6)}<br />Lng: {lng.toFixed(6)}</Popup></Marker>}
  </MapContainer>;
}
