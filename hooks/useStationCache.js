// hooks/useStationCache.js
import * as SQLite from 'expo-sqlite';

// Open (or create) the local SQLite database
const db = SQLite.openDatabaseSync('fueltracker.db');

// Create the stations table if it doesn't exist
export const initDB = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS stations (
            id TEXT PRIMARY KEY, 
            name TEXT, 
            address TEXT,
            petrol REAL,
            diesel REAL,
            longitude REAL,
            latitude REAL,
            cachedAt INTEGER
        );
    `);
};

// Save stations array to SQLite
export const cacheStations = (stations) => {
    const now = Date.now();
    // Clear old cache first
    db.execSync('DELETE FROM stations;');

    for (const s of stations) {
        db.runSync(
            `INSERT INTO stations (id, name, address, petrol, diesel, longitude, latitude, cachedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
             [
                s._id,
                s.name,
                s.address,
                s.prices?.petrol ?? null,
                s.prices?.diesel ?? null,
                s.location?.coordinates[0] ?? null,
                s.location?.coordinates[1] ?? null,
                now
             ]
        );
    }
    console.log(`Cached ${stations.length} stations to SQLite`);
};

// Read stations from SQLite cache
export const getCachedStations = () => {
    const rows = db.getAllSync('SELECT * FROM stations;');

    // Convert back to the same format as the API response
    return rows.map(row => ({
        _id: row.id,
        name: row.name,
        address: row.address,
        prices: {
            petrol: row.petrol,
            diesel: row.diesel
        },
        location: {
            type: 'Point',
            coordinates: [row.longitude, row.latitude]
        },
        cachedAt: row.cachedAt
    }));
};

// Check if cache is fresh (less than 1 hour old)
export const isCacheFresh = () => {
    const row = db.getAllSync('SELECT cachedAt FROM stations LIMIT 1;');
    if (row.length === 0) return false; // No cache at all
    const age = Date.now() - row[0].cachedAt;
    return age < 60 * 60 * 1000; // 1 hour in milliseconds
};