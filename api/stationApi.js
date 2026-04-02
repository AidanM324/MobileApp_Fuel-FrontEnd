// api/stationApi.js
import { BASE_URL } from '../config';

// Get all stations (public)
async function getAllStations() {
  const res = await fetch(`${BASE_URL}/stations`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);

  return res.json();
}

// GET nearby stations by lat/lng (public)
async function getNearbyStations(lat, lng, maxDistance = 5000) {
  const res = await fetch(
    `${BASE_URL}/stations/nearby?lat=${lat}&lng=${lng}&maxDistance=${maxDistance}`, {
      headers: { 'Content-Type': 'application/json' },
    });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

// GET user favourites (protected)
async function getFavourites(token) {
  const res = await fetch(`${BASE_URL}/users/favourites`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

// Add a favourite (protected)
async function addFavourite(stationId, token) {
  const res = await fetch(`${BASE_URL}/users/favourites/${stationId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

// Remove a favourite (protected)
async function removeFavourite(stationId, token) {
  const res = await fetch(`${BASE_URL}/users/favourites/${stationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Server responded ${res.status}`);
  return res.json();
}

export default {
  getAllStations,
  getNearbyStations,
  getFavourites,
  addFavourite,
  removeFavourite,
};
