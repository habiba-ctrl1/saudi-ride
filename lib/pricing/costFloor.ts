// Estimated cost floor for a route × vehicle: fuel + driver hours + maintenance +
// overhead, all scaled by the route's deadheadFactor (empty return). If a fare is
// ever set below this, verify-pricing fails the build.

import { COST_MODEL } from "./data/costModel";
import { getVehicle, type VehicleSlug } from "./data/vehicles";
import { getRoute } from "./data/routes";

export interface CostFloorBreakdown {
  fuel: number;
  driver: number;
  maintenance: number;
  overhead: number;
  costedKm: number;
  total: number;
}

export function costFloorFor(routeSlug: string, vehicleSlug: VehicleSlug): CostFloorBreakdown {
  const route = getRoute(routeSlug);
  const v = getVehicle(vehicleSlug);
  const distanceKm = route?.distanceKm ?? 0;
  const durationMin = route?.durationMinutes ?? Math.max(30, distanceKm);
  const deadhead = route?.deadheadFactor ?? 1.5;

  const costedKm = distanceKm * deadhead;
  const driverHours = (durationMin / 60) * deadhead;

  const fuel = (costedKm / 100) * v.consumptionPer100km * COST_MODEL.fuelPricePerLitre;
  const driver = driverHours * COST_MODEL.driverHourlyCost;
  const maintenance = costedKm * COST_MODEL.maintenancePerKm;
  const overhead = (driverHours / COST_MODEL.workingHoursPerDay) * COST_MODEL.insuranceAndOverheadPerDay;

  return {
    fuel: Math.round(fuel),
    driver: Math.round(driver),
    maintenance: Math.round(maintenance),
    overhead: Math.round(overhead),
    costedKm: Math.round(costedKm),
    total: Math.round(fuel + driver + maintenance + overhead),
  };
}
