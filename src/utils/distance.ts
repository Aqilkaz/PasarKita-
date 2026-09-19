/**
 * Distance and Location Utilities
 */

// Haversine formula to compute great-circle distance between two points in km
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Number(d.toFixed(1));
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Convert coordinates to an approximate district / locality description
// Crucial: Exact coordinates are NEVER exposed to other users
export function getApproximateAreaName(lat: number, lng: number): string {
  // Common Klang Valley landmarks / reference zones
  if (lat >= 3.09 && lat <= 3.14 && lng >= 3.11 && lng <= 101.69) {
    return 'Lembah Pantai / Bangsar South Area';
  } else if (lat >= 3.13 && lat <= 3.17 && lng >= 101.69 && lng <= 101.73) {
    return 'Kuala Lumpur Central / Bukit Bintang Area';
  } else if (lat >= 3.06 && lat <= 3.11 && lng >= 101.70 && lng <= 101.76) {
    return 'Cheras / Bandar Tun Razak Area';
  } else if (lat >= 3.03 && lat <= 3.10 && lng >= 101.50 && lng <= 101.60) {
    return 'Shah Alam / Subang Jaya Area';
  } else if (lat >= 2.95 && lat <= 3.05 && lng >= 101.60 && lng <= 101.75) {
    return 'Puchong / Seri Kembangan Area';
  } else {
    return 'Klang Valley / Greater KL Area';
  }
}

export function formatDistanceDisplay(distanceKm: number, isBm = false): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return isBm ? `${meters} m dari anda` : `${meters} m from you`;
  }
  return isBm ? `${distanceKm} km dari anda` : `${distanceKm} km from you`;
}
