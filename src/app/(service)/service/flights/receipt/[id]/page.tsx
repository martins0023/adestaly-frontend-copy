"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UseGetApi } from '@/src/config/Action';
import { FaPlane, FaDownload, FaSpinner, FaCheckCircle, FaExclamationCircle, FaUser, FaRegClock, FaTicketAlt, FaPassport, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function FlightReceipt() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID provided.");
      setLoading(false);
      return;
    }

    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const res = await UseGetApi(`api/flight/booking/${bookingId}`);
        if (res?.success) {
          setBooking(res.data);
        } else {
          setError(res?.message || "Failed to load flight booking details.");
        }
      } catch (err) {
        setError("Error fetching flight itinerary details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <FaExclamationCircle className="text-5xl text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Itinerary Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <button 
          onClick={() => router.push('/service/flights')} 
          className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-opacity-90 transition"
        >
          Return to Flights
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pb-20 pt-6 px-4 sm:px-6">
      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body, html { background: white !important; }
          .no-print { display: none !important; }
          .print-area { box-shadow: none !important; border: none !important; padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
          #bottom-nav { display: none !important; }
        }
      `}} />

      <div className="max-w-2xl mx-auto space-y-4">
        
        {/* Back Button */}
        <div className="no-print">
          <button 
            onClick={() => router.push('/service/flights')} 
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition font-semibold text-xs pl-1"
          >
            <FaArrowLeft /> Back to Flight Service
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="print-area bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden"
        >
          {/* Header Receipt Card */}
          <div className="bg-primary/5 px-6 py-8 border-b border-gray-100 relative overflow-hidden">
            {/* Background design accents */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-5 text-gray-900 pointer-events-none text-9xl">
              <FaPlane className="-rotate-45" />
            </div>

            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">E-Ticket Receipt</span>
                <h2 className="text-xl font-black text-gray-900 mt-1">{booking.airline}</h2>
                <p className="text-xs text-gray-400 font-semibold">Flight No: {booking.flightNumber}</p>
              </div>
              <div className="text-right space-y-1">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">PNR Reference</span>
                <span className="block text-lg font-black font-mono text-gray-900 select-all">{booking.pnr || "CONFIRMED"}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600">
                  <FaCheckCircle /> Issued
                </span>
              </div>
            </div>
          </div>

          {/* Boarding Pass / Route Info */}
          <div className="p-6 border-b border-dashed border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="text-left space-y-1">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{booking.origin}</h3>
                <span className="text-[10px] uppercase font-bold text-gray-400">Origin City</span>
              </div>

              {/* Path connector line */}
              <div className="flex-1 flex items-center justify-center relative">
                <div className="w-full h-0.5 border-t-2 border-dashed border-gray-200"></div>
                <div className="absolute w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-primary text-xs">
                  <FaPlane />
                </div>
              </div>

              <div className="text-right space-y-1">
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{booking.destination}</h3>
                <span className="text-[10px] uppercase font-bold text-gray-400">Destination City</span>
              </div>
            </div>

            {/* Flight Timings and Dates */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100">
              <div className="text-left space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1"><FaRegClock /> Departure Date</span>
                <p className="text-sm font-bold text-gray-800">
                  {new Date(booking.departureDate).toLocaleDateString(undefined, {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center justify-end gap-1"><FaTicketAlt /> Cabin Class</span>
                <p className="text-sm font-bold text-gray-800 capitalize">{booking.cabinClass}</p>
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="p-6 border-b border-gray-100">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <FaUser /> Passenger Details
            </h4>
            
            <div className="space-y-4">
              {booking.passengerDetails.map((passenger: any, idx: number) => (
                <div key={idx} className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-medium text-gray-600">
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">Name</span>
                    <span className="text-sm font-bold text-gray-800 capitalize">
                      {passenger.title}. {passenger.firstName} {passenger.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5">Contact</span>
                    <span className="block text-gray-800 truncate">{passenger.email}</span>
                    <span className="block text-gray-400 font-semibold">{passenger.phone}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="block text-[9px] uppercase font-bold text-gray-400 mb-0.5 flex items-center gap-0.5"><FaPassport /> Gender</span>
                    <span className="text-sm font-bold text-gray-800 capitalize">
                      {passenger.gender === 'm' ? 'Male' : 'Female'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment details summary */}
          <div className="p-6 bg-gray-50/30">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                <span>Flight ticket base price:</span>
                <span className="text-gray-700">₦{Number(booking.amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                <span>Airport taxes & fees:</span>
                <span className="text-green-600">Included</span>
              </div>
              <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-3 text-sm font-black text-gray-900">
                <span>Total Amount Paid (NGN):</span>
                <span className="text-lg font-black text-primary">₦{Number(booking.amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer branding */}
          <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Boarding Pass & Itinerary • Subscription Platform</p>
          </div>
        </motion.div>

        {/* Print/Download controls */}
        <div className="flex justify-center items-center pt-2 no-print">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-opacity-95 active:scale-98 transition"
          >
            <FaDownload /> Print / Download PDF Ticket
          </button>
        </div>

      </div>
    </section>
  );
}
