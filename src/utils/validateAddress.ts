export async function validateAddress(address: string): Promise<{ isValid: boolean, distance: number }> {
  const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`);
  const data = await response.json();

  if (data.features.length === 0) {
    return { isValid: false, distance: 0 }; 
  }

  const userCoords = data.features[0].geometry.coordinates;
  const parisCoords = [2.3522, 48.8566]; // Coordonnées de Paris

  const distance = calculateDistance(parisCoords, userCoords);
  return { isValid: distance <= 50, distance };
}

function calculateDistance([lon1, lat1]: number[], [lon2, lat2]: number[]): number {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
}
