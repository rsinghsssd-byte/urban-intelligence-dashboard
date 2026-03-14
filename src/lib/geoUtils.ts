// Calculate distance between two coordinates in kilometers using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GridCell {
  center: Coordinates;
  bounds: [Coordinates, Coordinates, Coordinates, Coordinates];
  isUnderserved: boolean;
  distanceToNearest: number;
}

// Generate a rough grid over a bounding box
export function generateCityGrid(
  minLat: number, maxLat: number,
  minLon: number, maxLon: number,
  gridSteps: number = 20
): GridCell[] {
  const grid: GridCell[] = [];
  
  const latStep = (maxLat - minLat) / gridSteps;
  const lonStep = (maxLon - minLon) / gridSteps;
  
  for (let i = 0; i < gridSteps; i++) {
    for (let j = 0; j < gridSteps; j++) {
      const cellMinLat = minLat + (i * latStep);
      const cellMaxLat = cellMinLat + latStep;
      const cellMinLon = minLon + (j * lonStep);
      const cellMaxLon = cellMinLon + lonStep;
      
      const centerLat = cellMinLat + (latStep / 2);
      const centerLon = cellMinLon + (lonStep / 2);
      
      grid.push({
        center: { lat: centerLat, lon: centerLon },
        bounds: [
          { lat: cellMinLat, lon: cellMinLon },
          { lat: cellMinLat, lon: cellMaxLon },
          { lat: cellMaxLat, lon: cellMaxLon },
          { lat: cellMaxLat, lon: cellMinLon }
        ],
        isUnderserved: false,
        distanceToNearest: Infinity
      });
    }
  }
  
  return grid;
}

// Analyze which grid cells lack ALL of the provided active services within thresholdKm
export function analyzeUnderservedAreas(
  grid: GridCell[],
  activeDatasets: { [key: string]: { lat: number; lon: number }[] },
  thresholdKm: number = 3
): GridCell[] {
  const keys = Object.keys(activeDatasets);
  
  if (keys.length === 0) {
    return grid.map(cell => ({ ...cell, distanceToNearest: Infinity, isUnderserved: false }));
  }

  return grid.map(cell => {
    let unservedByAll = true; // Assume unserved until we find a service within the threshold
    let minDistanceOverall = Infinity;

    for (const key of keys) {
      const dataset = activeDatasets[key];
      let minDist = Infinity;
      
      if (dataset && dataset.length > 0) {
        for (const item of dataset) {
          const dist = calculateDistance(cell.center.lat, cell.center.lon, item.lat, item.lon);
          if (dist < minDist) minDist = dist;
        }
      }
      
      if (minDist < minDistanceOverall) minDistanceOverall = minDist;
      
      // If ANY selected amenity is WITHIN the threshold, this area is not completely unserved
      if (minDist <= thresholdKm) {
        unservedByAll = false;
      }
    }

    return {
      ...cell,
      distanceToNearest: minDistanceOverall === Infinity ? 0 : minDistanceOverall,
      isUnderserved: unservedByAll
    };
  });
}
