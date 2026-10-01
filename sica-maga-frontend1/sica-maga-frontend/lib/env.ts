export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1',
  mapLat: Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_LAT ?? 14.6349),
  mapLng: Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_LNG ?? -90.5069),
  mapZoom: Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM ?? 7),
};
