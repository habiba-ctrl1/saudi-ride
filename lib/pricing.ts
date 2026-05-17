// Distance-based pricing matrix
export const PRICING_CONFIG = {
  baseFare: 50, // SAR
  perKm: {
    SEDAN: 3.5,
    SUV: 5.0,
    VAN: 4.5,
    LUXURY: 8.0,
    BUS: 7.0,
  },
  minimumFare: {
    SEDAN: 80,
    SUV: 120,
    VAN: 110,
    LUXURY: 200,
    BUS: 300,
  },
  // Fixed popular route prices
  fixedRoutes: {
    'jeddah-airport-makkah': { SEDAN: 180, SUV: 280, VAN: 250, LUXURY: 450, BUS: 700 },
    'makkah-madinah': { SEDAN: 350, SUV: 500, VAN: 450, LUXURY: 800, BUS: 1200 },
    'madinah-jeddah-airport': { SEDAN: 350, SUV: 500, VAN: 450, LUXURY: 800, BUS: 1200 },
    'riyadh-dammam': { SEDAN: 280, SUV: 400, VAN: 350, LUXURY: 650, BUS: 950 },
    'riyadh-jeddah': { SEDAN: 600, SUV: 900, VAN: 800, LUXURY: 1400, BUS: 2000 },
    'riyadh-dubai': { SEDAN: 1200, SUV: 1800, VAN: 1600, LUXURY: 2800, BUS: 4000 },
    'dammam-doha': { SEDAN: 500, SUV: 750, VAN: 650, LUXURY: 1200, BUS: 1800 },
    'jeddah-taif': { SEDAN: 220, SUV: 320, VAN: 280, LUXURY: 500, BUS: 750 },
  },
  roundTripDiscount: 0.10, // 10% off
  nightSurcharge: 0.15, // 15% after 11pm
  ramadanSurcharge: 0.20, // 20% during Ramadan
};

/**
 * Normalizes input address strings to check if they match a fixed route key
 */
export function matchFixedRoute(pickup: string, dropoff: string): string | null {
  const p = pickup.toLowerCase();
  const d = dropoff.toLowerCase();

  if (p.includes('jeddah') && p.includes('airport') && d.includes('makkah')) return 'jeddah-airport-makkah';
  if (p.includes('makkah') && d.includes('madinah')) return 'makkah-madinah';
  if (p.includes('madinah') && d.includes('jeddah') && d.includes('airport')) return 'madinah-jeddah-airport';
  if (p.includes('riyadh') && d.includes('dammam')) return 'riyadh-dammam';
  if (p.includes('riyadh') && d.includes('jeddah')) return 'riyadh-jeddah';
  if (p.includes('riyadh') && d.includes('dubai')) return 'riyadh-dubai';
  if (p.includes('dammam') && d.includes('doha')) return 'dammam-doha';
  if (p.includes('jeddah') && d.includes('taif')) return 'jeddah-taif';

  return null;
}
