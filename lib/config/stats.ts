// Global statistics configuration for Taxi Saudi Arabia to prevent mismatched numbers and ensure absolute brand consistency.

import { ROUTES_DATA } from "@/lib/data/routes";

const routesCount = ROUTES_DATA.length;

export const trustStats = {
  routesCovered: `${routesCount}+`,
  routesCount,
  licensedDrivers: "100%",
  citiesCovered: "11+",
  activeChauffeurs: "24/7",
  fixedPriceGuarantee: "100%",
  languagesSpoken: "3",
  vehicleClasses: "14",
};
