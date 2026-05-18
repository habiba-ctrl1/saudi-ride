"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Booking, Vehicle } from "@prisma/client";
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type BookingWithVehicle = Booking & { vehicle: Vehicle };

export const columns: ColumnDef<BookingWithVehicle>[] = [
  {
    accessorKey: "bookingRef",
    header: "Ref",
    cell: ({ row }) => <div className="font-mono text-[#C9A84C] text-xs">{row.getValue("bookingRef")}</div>,
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <div className="font-medium text-[#F5F0E8]">{row.original.customerName}</div>
        <div className="text-xs text-[#A1A1A6]">{row.original.customerPhone}</div>
      </div>
    ),
  },
  {
    accessorKey: "pickupLocation",
    header: "Route",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-xs text-[#A1A1A6]">
        {row.original.pickupLocation} <span className="text-[#C9A84C]">→</span> {row.original.dropoffLocation}
      </div>
    ),
  },
  {
    accessorKey: "pickupDateTime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:text-[#F5F0E8] hover:bg-[#C9A84C]/10 -ml-4"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-xs">{new Date(row.original.pickupDateTime).toLocaleDateString()}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span className={`inline-flex items-center px-2 py-1 rounded text-[0.65rem] font-bold uppercase tracking-wider ${
          status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
          status === 'CONFIRMED' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
          status === 'COMPLETED' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
          'bg-[#333] text-[#A1A1A6] border border-[#444]'
        }`}>
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "totalPrice",
    header: "Price",
    cell: ({ row }) => <div className="font-bold text-[#F5F0E8] text-right">{row.original.currency} {row.original.totalPrice}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0 text-[#A1A1A6] hover:text-[#C9A84C] inline-flex items-center justify-center rounded-md">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#111] border-[#C9A84C]/20 text-[#F5F0E8]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(booking.bookingRef)}
              className="cursor-pointer hover:bg-[#C9A84C]/10"
            >
              Copy booking ref
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#C9A84C]/20" />
            <DropdownMenuItem className="cursor-pointer hover:bg-[#C9A84C]/10">
              <Link href={`/admin/bookings/${booking.id}`} className="flex items-center w-full">
                <Eye className="mr-2 h-4 w-4" />
                View details
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
