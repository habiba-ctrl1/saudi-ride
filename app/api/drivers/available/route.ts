import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") ?? "");
    const lng = parseFloat(searchParams.get("lng") ?? "");
    const radiusKm = parseFloat(searchParams.get("radius_km") ?? "50");
    const vehicleClass = searchParams.get("vehicle_class");
    const language = searchParams.get("language");
    const ihramOnly = searchParams.get("ihram") === "true";
    const minRating = parseFloat(searchParams.get("min_rating") ?? "0");

    const drivers = await prisma.driver.findMany({
      where: {
        status: "AVAILABLE",
        ...(ihramOnly ? { ihramStatus: true } : {}),
        ...(language ? { languages: { has: language.toLowerCase() } } : {}),
        ...(minRating > 0 ? { rating: { gte: minRating } } : {}),
      },
      include: {
        user: { select: { name: true, phone: true, image: true, nationality: true, preferredLang: true } },
      },
      orderBy: { rating: "desc" },
    });

    // Filter by vehicle class (check the driver's current vehicle)
    let filtered = drivers;
    if (vehicleClass) {
      const typeMap: Record<string, string> = {
        sedan: "SEDAN", suv: "SUV", cabin: "VAN", van: "VAN",
        elite: "LUXURY", luxury: "LUXURY", coaster: "BUS", bus: "BUS",
      };
      const dbType = typeMap[vehicleClass.toLowerCase()];
      if (dbType && filtered.length > 0) {
        const vehicleIds = filtered
          .map((d) => d.vehicleId)
          .filter(Boolean) as string[];
        const vehicles = vehicleIds.length
          ? await prisma.vehicle.findMany({
              where: { id: { in: vehicleIds }, type: dbType as "SEDAN" | "SUV" | "VAN" | "LUXURY" | "BUS" },
              select: { id: true },
            })
          : [];
        const validVehicleIds = new Set(vehicles.map((v) => v.id));
        filtered = filtered.filter((d) => d.vehicleId && validVehicleIds.has(d.vehicleId));
      }
    }

    // Filter by radius if coordinates provided
    if (!isNaN(lat) && !isNaN(lng)) {
      filtered = filtered.filter((d) => {
        if (d.currentLat === null || d.currentLng === null) return false;
        return haversineKm(lat, lng, d.currentLat, d.currentLng) <= radiusKm;
      });
    }

    const result = filtered.map((d) => ({
      id: d.id,
      name: d.user.name,
      phone: d.user.phone,
      rating: d.rating,
      total_trips: d.totalTrips,
      languages: d.languages,
      ihram_status: d.ihramStatus,
      tga_certified: d.tgaCertified,
      vehicle_id: d.vehicleId,
      current_location:
        d.currentLat && d.currentLng
          ? { lat: d.currentLat, lng: d.currentLng }
          : null,
      status: d.status,
    }));

    return NextResponse.json({ success: true, count: result.length, drivers: result });
  } catch (error) {
    console.error("GET /api/drivers/available error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
