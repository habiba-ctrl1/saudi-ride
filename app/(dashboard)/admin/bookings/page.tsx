import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { columns } from "./columns";
import { BookingsClient } from "./BookingsClient";

export const metadata: Metadata = {
  title: "Manage Bookings | Admin Dashboard",
};

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const data = await prisma.booking.findMany({
    include: {
      vehicle: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return <BookingsClient columns={columns} data={data} />;
}
