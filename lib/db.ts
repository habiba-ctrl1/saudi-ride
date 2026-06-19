import { VehicleType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Single shared Prisma instance — `db` is just an alias for `prisma`
// so we never open two separate connection pools (important on
// Supabase free-tier where connections are limited).
export const db = prisma;

export async function ensureVehiclesSeeded() {
  try {
    const count = await db.vehicle.count();
    if (count > 0) return;

    const defaultVehicles = [
      {
        name: "Toyota Camry Executive",
        nameAr: "تويوتا كامري إكزيكتيف",
        nameUr: "ٹویوٹا کیمری ایگزیکٹو",
        type: VehicleType.SEDAN,
        capacity: 3,
        luggage: 2,
        pricePerKm: 3.5,
        basePrice: 50.0,
        image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=600&q=80",
        features: ["Leather Seats", "Free Wifi", "Mineral Water", "AC"],
      },
      {
        name: "GMC Yukon Denali XL",
        nameAr: "جي إم سي يوكون دينالي إكس إل",
        nameUr: "جی ایم سی یوکون ڈینالی",
        type: VehicleType.SUV,
        capacity: 6,
        luggage: 5,
        pricePerKm: 5.0,
        basePrice: 50.0,
        image: "https://images.unsplash.com/photo-1601929862074-04b7b88f0c82?auto=format&fit=crop&w=600&q=80",
        features: ["VIP Tinted Windows", "Climate Control", "Child Seat Ready", "Prayer Mats Available"],
      },
      {
        name: "Hyundai Staria Luxury",
        nameAr: "هيونداي ستاريا الفاخرة",
        nameUr: "ہونڈائی اسٹاریا لگژری",
        type: VehicleType.VAN,
        capacity: 7,
        luggage: 7,
        pricePerKm: 4.5,
        basePrice: 50.0,
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80",
        features: ["Captain Chairs", "Extra Legroom", "Perfect for Families", "USB Ports"],
      },
      {
        name: "Mercedes-Benz S-Class Elite",
        nameAr: "مرسيدس بنز الفئة إس إيليت",
        nameUr: "مرسڈیز بینز ایس کلاس",
        type: VehicleType.LUXURY,
        capacity: 3,
        luggage: 3,
        pricePerKm: 8.0,
        basePrice: 50.0,
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80",
        features: ["Panoramic Sunroof", "VIP Chauffeur service", "Premium Sound", "KSA Refreshments"],
      },
      {
        name: "VIP Pilgrim Bus/Coaster",
        nameAr: "حافلة كوستير الفاخرة للحجاج",
        nameUr: "وی آئی پی زائرین بس",
        type: VehicleType.BUS,
        capacity: 18,
        luggage: 15,
        pricePerKm: 7.0,
        basePrice: 50.0,
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        features: ["Large Group Transport", "Pilgrim Luggage Space", "Meeqat Stop Option", "English/Arabic Driver"],
      },
    ];

    for (const veh of defaultVehicles) {
      await db.vehicle.create({ data: veh });
    }
    console.log("Database vehicles seeded successfully.");
  } catch (error) {
    console.error("Auto seeding failed:", error);
  }
}
