"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Download,
  RefreshCw,
  Eye,
  XCircle,
  Truck,
  UserCheck
} from "lucide-react";

type BookingRow = {
  id: string;
  bookingRef: string;
  status: 'PENDING' | 'CONFIRMED' | 'DRIVER_ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  returnDateTime: string | null;
  isRoundTrip: boolean;
  passengers: number;
  totalPrice: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  notes: string | null;
  driverName: string | null;
  driverPhone: string | null;
  flightNumber: string | null;
  createdAt: string;
  vehicle: {
    name: string;
    type: string;
  };
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [vehicleFilter, setVehicleFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Detail Modal
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to load dispatch bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Error loading bookings database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchBookings();
  }, []);

  // Update Status Action
  const handleUpdateStatus = async (ref: string, newStatus: string) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/bookings/${ref}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_STATUS", status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      alert(`Booking status updated to ${newStatus}`);
      // Refresh
      await fetchBookings();
      // Update selected modal
      const updatedItem = bookings.find(b => b.bookingRef === ref);
      if (updatedItem) {
        setSelectedBooking({ ...updatedItem, status: newStatus as BookingRow['status'] });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update booking status");
    } finally {
      setActionLoading(false);
    }
  };

  // Assign Driver Action
  const handleAssignDriver = async (ref: string) => {
    if (!driverName.trim() || !driverPhone.trim()) {
      alert("Please provide both chauffeur name and phone number");
      return;
    }
    try {
      setActionLoading(true);
      const res = await fetch(`/api/bookings/${ref}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ASSIGN_DRIVER",
          driverName: driverName.trim(),
          driverPhone: driverPhone.trim()
        })
      });
      if (!res.ok) throw new Error("Failed to assign driver");

      alert(`Chauffeur ${driverName} assigned to booking ${ref}`);
      setDriverName("");
      setDriverPhone("");
      await fetchBookings();
      setSelectedBooking(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Chauffeur assignment failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Filtering Logic
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    const matchesVehicle = vehicleFilter === "ALL" || b.vehicle.type === vehicleFilter;
    const matchesSearch =
      searchQuery === "" ||
      b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerPhone.includes(searchQuery) ||
      b.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.dropoffLocation.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesVehicle && matchesSearch;
  });

  // Metric Computations
  const totalFares = filteredBookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const pendingCount = bookings.filter(b => b.status === "PENDING").length;
  const activeCount = bookings.filter(b => b.status === "IN_PROGRESS").length;

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredBookings.length === 0) return;
    const headers = [
      "Booking Reference",
      "Customer Name",
      "Customer Phone",
      "Customer Email",
      "Pickup Location",
      "Dropoff Location",
      "Date & Time",
      "Vehicle Class",
      "Total Price (SAR)",
      "Status",
      "Chauffeur Allocated",
      "Chauffeur Phone"
    ];

    const csvRows = [headers.join(",")];

    for (const b of filteredBookings) {
      const row = [
        b.bookingRef,
        `"${b.customerName.replace(/"/g, '""')}"`,
        b.customerPhone,
        b.customerEmail || "",
        `"${b.pickupLocation.replace(/"/g, '""')}"`,
        `"${b.dropoffLocation.replace(/"/g, '""')}"`,
        new Date(b.pickupDateTime).toLocaleString(),
        b.vehicle.type,
        b.totalPrice,
        b.status,
        b.driverName || "Unallocated",
        b.driverPhone || ""
      ];
      csvRows.push(row.join(","));
    }

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RLT_Dispatch_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] pt-24 pb-16 px-4 md:px-8 relative overflow-hidden">
      
      {/* Background radial luxury glows */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#C9A84C]/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10 text-left">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#C9A84C]/10 pb-6">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#F5F0E8] flex items-center gap-2">
              <span className="text-[#C9A84C]">👑</span> Executive Dispatch Center
            </h1>
            <p className="text-xs text-[#A1A1A6] mt-1">
              Real-time fleet coordination, driver assignment console, and pricing compliance database.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => void fetchBookings()}
              className="flex items-center gap-2 rounded-full border border-[#C9A84C]/25 bg-black/45 px-4.5 py-2 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportCSV}
              disabled={filteredBookings.length === 0}
              className="flex items-center gap-2 rounded-full bg-[#C9A84C] px-4.5 py-2 text-xs font-bold text-[#0A0A0A] hover:bg-[#B8963B] disabled:opacity-50 transition-all shadow-[0_4px_15px_rgba(201,168,76,0.2)]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Dashboard Metrics grid */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="rounded-2xl border border-[#C9A84C]/10 bg-[#121212] p-5">
            <span className="text-[0.6rem] uppercase tracking-wider text-[#7C8088] font-bold">Total Active Bookings</span>
            <p className="font-heading text-2xl font-bold text-[#F5F0E8] mt-1">{filteredBookings.length}</p>
          </div>

          <div className="rounded-2xl border border-[#C9A84C]/10 bg-[#121212] p-5">
            <span className="text-[0.6rem] uppercase tracking-wider text-amber-500 font-bold">Pending Dispatch</span>
            <p className="font-heading text-2xl font-bold text-amber-400 mt-1">{pendingCount}</p>
          </div>

          <div className="rounded-2xl border border-[#C9A84C]/10 bg-[#121212] p-5">
            <span className="text-[0.6rem] uppercase tracking-wider text-blue-500 font-bold">Journeys En Route</span>
            <p className="font-heading text-2xl font-bold text-blue-400 mt-1">{activeCount}</p>
          </div>

          <div className="rounded-2xl border border-[#C9A84C]/10 bg-[#121212] p-5">
            <span className="text-[0.6rem] uppercase tracking-wider text-[#C9A84C] font-bold">Total Fares (SAR)</span>
            <p className="font-heading text-2xl font-bold text-[#C9A84C] mt-1">SAR {totalFares.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter Controls Panel */}
        <div className="grid gap-4 md:grid-cols-4 bg-[#121212] p-4 rounded-2xl border border-[#C9A84C]/10">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-[#7C8088]" />
            <input
              type="text"
              placeholder="Search reference, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 pl-9 pr-4 py-2.5 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none focus:border-[#C9A84C]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-2.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="DRIVER_ASSIGNED">Chauffeur Assigned</option>
              <option value="IN_PROGRESS">En Route</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-2.5 text-xs text-[#F5F0E8] outline-none focus:border-[#C9A84C]"
            >
              <option value="ALL">All Vehicle Classes</option>
              <option value="SEDAN">Premium Sedan</option>
              <option value="SUV">VIP SUV</option>
              <option value="VAN">Luxury Cabin Van</option>
              <option value="LUXURY">Mercedes S-Class Elite</option>
              <option value="BUS">VIP Pilgrim Bus</option>
            </select>
          </div>

          <div className="flex items-center justify-end text-[0.65rem] text-[#7C8088] font-bold pr-2">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>

        {/* Database Bookings Grid / Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#C9A84C] border-t-transparent mb-4" />
            <p className="text-xs text-[#7C8088]">Fetching database logs...</p>
          </div>
        ) : errorMsg ? (
          <div className="rounded-2xl border border-red-900/30 bg-red-950/10 p-6 text-center text-xs text-red-400">
            {errorMsg}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-[#C9A84C]/10 bg-[#121212] p-12 text-center text-xs text-[#7C8088]">
            No records matched current search coordinates.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[#C9A84C]/10 bg-[#121212] shadow-2xl">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-black/50 border-b border-[#C9A84C]/15 text-[#7C8088] uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-4">Reference</th>
                  <th className="px-4 py-4">Client Name</th>
                  <th className="px-4 py-4">Coordinates</th>
                  <th className="px-4 py-4">Schedule</th>
                  <th className="px-4 py-4">Class</th>
                  <th className="px-4 py-4">Fare</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C9A84C]/10">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-4 font-bold text-[#C9A84C] font-mono">{b.bookingRef}</td>
                    <td className="px-4 py-4 font-semibold text-[#F5F0E8]">{b.customerName}</td>
                    <td className="px-4 py-4 text-[#A1A1A6]">
                      <div className="truncate max-w-[150px]">{b.pickupLocation}</div>
                      <div className="text-[0.6rem] text-[#7C8088] truncate max-w-[150px]">➔ {b.dropoffLocation}</div>
                    </td>
                    <td className="px-4 py-4 text-[#A1A1A6]">
                      <div>{new Date(b.pickupDateTime).toLocaleDateString()}</div>
                      <div className="text-[0.6rem] text-[#7C8088]">
                        {new Date(b.pickupDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-bold">{b.vehicle.type}</td>
                    <td className="px-4 py-4 font-bold text-[#C9A84C]">SAR {b.totalPrice}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[0.55rem] font-bold uppercase ${
                        b.status === "PENDING" ? "bg-amber-950/40 text-amber-400 border border-amber-900/30" :
                        b.status === "CONFIRMED" ? "bg-green-950/40 text-green-400 border border-green-900/30" :
                        b.status === "DRIVER_ASSIGNED" ? "bg-blue-950/40 text-blue-400 border border-blue-900/30" :
                        b.status === "IN_PROGRESS" ? "bg-purple-950/40 text-purple-400 border border-purple-900/30" :
                        b.status === "COMPLETED" ? "bg-zinc-900 text-zinc-400 border border-zinc-700" :
                        "bg-red-950/40 text-red-400 border border-red-900/30"
                      }`}>
                        {b.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="rounded-full bg-[#C9A84C]/10 hover:bg-[#C9A84C] p-2 text-[#C9A84C] hover:text-[#0A0A0A] transition-all"
                        title="View & Edit Booking Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Glassmorphic Dispatch & Driver Allocation Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-left">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#C9A84C]/20 bg-[#121212] p-6 shadow-2xl space-y-6 overflow-y-auto max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#C9A84C]/15 pb-4">
              <div>
                <span className="text-[0.65rem] uppercase tracking-wider text-[#7C8088] font-bold">DISPATCH OVERSEE</span>
                <h3 className="font-heading text-xl font-bold text-[#F5F0E8]">{selectedBooking.bookingRef}</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setDriverName("");
                  setDriverPhone("");
                }}
                className="rounded-full bg-black/45 border border-[#C9A84C]/15 p-1.5 text-[#A1A1A6] hover:text-[#C9A84C]"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {/* Content summary */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-black/45 p-4 rounded-2xl border border-[#C9A84C]/10">
              <div>
                <p className="text-[#7C8088] font-bold">CLIENT</p>
                <p className="font-semibold text-[#F5F0E8]">{selectedBooking.customerName}</p>
                <p className="text-[#A1A1A6]">{selectedBooking.customerPhone}</p>
              </div>

              <div>
                <p className="text-[#7C8088] font-bold">FARE</p>
                <p className="font-semibold text-[#C9A84C]">SAR {selectedBooking.totalPrice}</p>
                <p className="text-[#A1A1A6] uppercase">{selectedBooking.paymentMethod} ({selectedBooking.paymentStatus})</p>
              </div>

              <div className="col-span-2 pt-2 border-t border-[#C9A84C]/10">
                <p className="text-[#7C8088] font-bold">ROUTE</p>
                <p className="text-[#F5F0E8]">{selectedBooking.pickupLocation} ➔ {selectedBooking.dropoffLocation}</p>
              </div>

              <div className="col-span-2 pt-2 border-t border-[#C9A84C]/10">
                <p className="text-[#7C8088] font-bold font-mono">SCHEDULED DATE</p>
                <p className="text-[#F5F0E8]">
                  {new Date(selectedBooking.pickupDateTime).toLocaleString()}
                </p>
              </div>

              {selectedBooking.flightNumber && (
                <div className="col-span-2 pt-2 border-t border-[#C9A84C]/10 flex justify-between">
                  <span className="text-[#7C8088] font-bold">FLIGHT NUMBER</span>
                  <span className="text-[#C9A84C] font-semibold">{selectedBooking.flightNumber}</span>
                </div>
              )}
            </div>

            {/* Status Controller section */}
            <div className="space-y-3">
              <label className="block text-[0.65rem] uppercase tracking-wider text-[#A1A1A6] font-bold">
                Update Booking Status
              </label>
              
              <div className="flex gap-2">
                <select
                  defaultValue={selectedBooking.status}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="flex-1 rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-2 text-xs text-[#F5F0E8] outline-none"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="DRIVER_ASSIGNED">DRIVER ASSIGNED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                <button
                  onClick={() => handleUpdateStatus(selectedBooking.bookingRef, updateStatus || selectedBooking.status)}
                  disabled={actionLoading}
                  className="rounded-xl bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs px-4 py-2 hover:bg-[#B8963B] disabled:opacity-50"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Driver Allocation console section */}
            <div className="space-y-4 border-t border-[#C9A84C]/10 pt-4">
              <h4 className="font-heading text-xs uppercase tracking-wider text-[#C9A84C] font-bold flex items-center gap-1.5">
                <Truck className="h-4 w-4" /> Assign Chauffeur
              </h4>

              {selectedBooking.driverName && (
                <div className="bg-blue-950/20 border border-blue-900/30 rounded-xl p-3 text-xs text-blue-300">
                  Currently Assigned: <span className="font-bold">{selectedBooking.driverName}</span> ({selectedBooking.driverPhone})
                </div>
              )}

              <div className="grid gap-3 grid-cols-2">
                <div>
                  <label className="block text-[0.55rem] text-[#7C8088] font-bold uppercase mb-1">Chauffeur Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Captain Farhan"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-2 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[0.55rem] text-[#7C8088] font-bold uppercase mb-1">Chauffeur Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +966500123456"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full rounded-xl bg-black/40 border border-[#C9A84C]/10 px-3 py-2 text-xs text-[#F5F0E8] placeholder-[#7C8088] outline-none"
                  />
                </div>
              </div>

              <button
                onClick={() => handleAssignDriver(selectedBooking.bookingRef)}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-[#C9A84C]/35 bg-[#C9A84C]/10 py-3 text-xs font-bold text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-all"
              >
                <UserCheck className="h-4 w-4" />
                <span>Assign Chauffeur</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
