"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Modal from 'react-modal';
import {
  FaFilter,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaChevronRight,
  FaTimes,
  FaCalendarAlt,
  FaSpinner,
  FaExclamationCircle,
} from 'react-icons/fa';

import { UseGetApi } from '@/src/config/Action';

// --- Configuration & Helpers ---
const providerIcons: Record<string, string> = {
  Glo: '/images/glo.png',
  MTN: '/images/mtn.png',
  Airtel: '/images/airtel.png',
  '9mobile': '/images/etisalat.png',
};

const getStatusStyles = (status: string | undefined) => {
  if (!status) return 'bg-gray-100 text-gray-600';
  switch (status.toLowerCase()) {
    case 'success':
    case 'successful':
    case 'delivered':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'failed':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'pending':
    case 'initiated':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'Unknown Date';
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const determineProvider = (name = '') => {
  if (!name) return 'MTN';
  const lower = name.toLowerCase();
  if (lower.includes('mtn')) return 'MTN';
  if (lower.includes('glo')) return 'Glo';
  if (lower.includes('airtel')) return 'Airtel';
  if (lower.includes('9mobile') || lower.includes('etisalat')) return '9mobile';
  return 'MTN';
};

interface UITransaction {
  id: string;
  type: string;
  amount: string;
  status: string;
  provider: string;
  mobileNumber: string;
  date: string;
  timestamp: string;
  rawDate: string;
  ref: string;
}

export default function HistoryTopup() {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModalIsOpen, setFilterModalIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // Data State
  const [transactions, setTransactions] = useState<UITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const openFilterModal = () => setFilterModalIsOpen(true);
  const closeFilterModal = () => setFilterModalIsOpen(false);

  useEffect(() => {
    // Next.js specific: Set app element to body safely
    Modal.setAppElement(document.body);
  }, []);

  // --- FETCH DATA ON MOUNT ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await UseGetApi('api/bill/history', { limit: "100" });

        if (response && response.success) {
          // Robust array extraction to prevent 'rawData?.map is not a function'
          let rawData: any[] = [];
          const resData = response.data;
          
          if (Array.isArray(resData)) {
            rawData = resData;
          } else if (resData?.data && Array.isArray(resData.data)) {
            rawData = resData.data;
          } else if (resData?.details && Array.isArray(resData.details)) {
            rawData = resData.details;
          } else if (resData?.transactions && Array.isArray(resData.transactions)) {
            rawData = resData.transactions;
          }

          const mappedData: UITransaction[] = rawData.map((item: any) => ({
            id: item._id || Math.random().toString(),
            type: item.type || item.category || 'Transaction',
            amount: `₦${Number(item.amount || 0).toLocaleString()}`,
            status: item.status || 'Pending',
            provider: determineProvider(item.product_name || item.details?.network || item.reference),
            mobileNumber: item.unique_element || item.details?.phone || item.reference || 'N/A',
            date: formatDate(item.transaction_date || item.createdAt),
            timestamp: formatTime(item.transaction_date || item.createdAt),
            rawDate: item.transaction_date || item.createdAt,
            ref: item.transactionId || item.reference || 'N/A',
          }));
          
          setTransactions(mappedData);
        } else {
           setError(response.message || 'Failed to load transaction history.');
        }
      } catch (err) {
        console.error('Failed to load history:', err);
        setError('Failed to load transaction history.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.amount.includes(searchTerm) ||
        t.mobileNumber.includes(searchTerm) ||
        t.ref.includes(searchTerm);

      const matchesFilter =
        activeFilter === 'All' || t.type.toLowerCase().includes(activeFilter.toLowerCase());

      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, activeFilter, transactions]);

  // Group by Date
  const groupedTransactions = useMemo(() => {
    const groups: Record<string, UITransaction[]> = {};
    filteredTransactions.forEach((t) => {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  const filterOptions = ['All', 'Airtime', 'Data', 'Cable', 'Electricity'];

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* --- Sticky Header & Search --- */}
      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-sm pt-5 pb-2 px-5">
        <h1 className="text-2xl font-inter font-bold text-gray-900 mb-4">History</h1>

        <div className="flex flex-row gap-3 items-center">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by number, amount..."
              className="w-full bg-white py-3.5 pl-11 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm group-hover:border-gray-300"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" />
          </div>

          <button
            onClick={openFilterModal}
            className={`p-3.5 rounded-xl shadow-sm border transition-all ${
              activeFilter !== 'All'
                ? 'bg-[#FF8C00] text-white border-[#FF8C00]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <FaFilter className="text-lg" />
          </button>
        </div>

        {activeFilter !== 'All' && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              Showing:
            </span>
            <button
              type="button"
              className="text-xs bg-[#FF8C00]/10 text-[#FF8C00] px-2.5 py-1 rounded-md font-bold cursor-pointer flex items-center gap-1"
              onClick={() => setActiveFilter('All')}
            >
              {activeFilter} <FaTimesCircle />
            </button>
          </div>
        )}
      </div>

      {/* --- Content Area --- */}
      <div className="flex-1 mt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center pt-20">
            <FaSpinner className="animate-spin text-3xl text-[#FF8C00] mb-3" />
            <p className="text-sm text-gray-500">Loading activity...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center px-4">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <FaExclamationCircle className="text-2xl text-red-400" />
            </div>
            <p className="text-gray-800 font-medium mb-1">Something went wrong</p>
            <p className="text-xs text-gray-500">{error}</p>
          </div>
        ) : Object.keys(groupedTransactions).length > 0 ? (
          <motion.div
            className="px-5 space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Object.entries(groupedTransactions).map(([date, txns]) => (
              <div key={date}>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-300" /> {date}
                </h3>

                <div className="space-y-3">
                  {txns.map((t) => (
                    <motion.div key={t.id} variants={itemVariants}>
                      <Link href={`/transactiondetails?id=${t.id}`}>
                        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-gray-100 active:scale-[0.98] transition-all duration-200 hover:border-gray-200">
                          <div className="flex justify-between items-center">
                            {/* Left: Icon & Info */}
                            <div className="flex items-center gap-3.5">
                              <div className="relative">
                                <Image
                                  src={providerIcons[t.provider] || '/images/mtn.png'}
                                  alt={t.provider}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                />
                                <div
                                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center ${
                                    t.status.toLowerCase() === 'success' ||
                                    t.status.toLowerCase() === 'delivered' ||
                                    t.status.toLowerCase() === 'successful'
                                      ? 'bg-green-500'
                                      : t.status.toLowerCase() === 'failed'
                                        ? 'bg-red-500'
                                        : 'bg-yellow-500'
                                  }`}
                                />
                              </div>

                              <div className="flex flex-col">
                                <h3 className="font-bold text-gray-800 text-sm capitalize">
                                  {t.type}
                                </h3>
                                <p className="text-[11px] text-gray-500 font-medium truncate max-w-[120px]">
                                  {t.mobileNumber}
                                </p>
                              </div>
                            </div>

                            {/* Right: Amount & Time */}
                            <div className="flex flex-col items-end gap-1">
                              <span className="font-bold text-gray-900 text-sm">{t.amount}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-gray-400">{t.timestamp}</span>
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${getStatusStyles(
                                    t.status,
                                  )}`}
                                >
                                  {t.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center mt-6 mb-8">
              <button className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                End of list
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="text-2xl opacity-20" />
            </div>
            <p className="font-medium text-sm">No transactions found</p>
            <p className="text-xs text-gray-400 mt-1 max-w-[200px] text-center">
              Your recent payments and topups will appear here.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter('All');
                }}
                className="text-[#FF8C00] text-xs font-bold bg-[#FF8C00]/5 px-4 py-2 rounded-lg"
              >
                Clear Filters
              </button>
              <Link
                href="/dashboard"
                className="text-white text-xs font-bold bg-[#FF8C00] px-4 py-2 rounded-lg"
              >
                Make a Payment
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* --- Filter Modal --- */}
      <Modal
        isOpen={filterModalIsOpen}
        onRequestClose={closeFilterModal}
        contentLabel="Filter Transactions"
        className="fixed bottom-0 w-full sm:w-[400px] sm:left-1/2 sm:-translate-x-1/2 bg-white rounded-t-3xl outline-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      >
        <div className="flex flex-col pb-safe">
          <button
            type="button"
            aria-label="Close modal"
            className="w-full flex justify-center pt-3 pb-1"
            onClick={closeFilterModal}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </button>

          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Filter History</h2>
              <button
                type="button"
                onClick={closeFilterModal}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-1 mb-8">
              {filterOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveFilter(option);
                    closeFilterModal();
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all active:scale-[0.98] ${
                    activeFilter === option
                      ? 'bg-[#FF8C00] text-white shadow-lg shadow-[#FF8C00]/20'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100'
                  }`}
                >
                  <span className="text-sm font-semibold">
                    {option === 'All' ? 'All Transactions' : `${option} Only`}
                  </span>
                  {activeFilter === option ? (
                    <FaCheckCircle />
                  ) : (
                    <FaChevronRight className="text-gray-300 text-xs" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}