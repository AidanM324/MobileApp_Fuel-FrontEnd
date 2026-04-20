// hooks/useSortStations.js
export const sortStations = (stations, sortOption) => {
  if (!sortOption) return stations;

  return [...stations].sort((a, b) => {
    const aPetrol = a.prices?.petrol ?? 999;
    const bPetrol = b.prices?.petrol ?? 999;
    const aDiesel = a.prices?.diesel ?? 999;
    const bDiesel = b.prices?.diesel ?? 999;

    switch (sortOption) {
      case 'petrol_asc':  return aPetrol - bPetrol;
      case 'petrol_desc': return bPetrol - aPetrol;
      case 'diesel_asc':  return aDiesel - bDiesel;
      case 'diesel_desc': return bDiesel - aDiesel;
      default: return 0;
    }
  });
};