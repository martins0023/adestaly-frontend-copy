"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import AccountDetails from '@/src/components/Dashboard/AccountDetails';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { quickActions, servicesAction, tourSteps } from '@/src/constants/dashboardData';
import { FaArrowDown, FaArrowUp, FaHistory, FaSpinner } from 'react-icons/fa';
import { UseGetApi } from '@/src/config/Action';
import { formatDate } from '@/src/constants/formatDate';
import { PinModal } from '@/src/components/Dashboard/PinModal';
import { PinSuccessModal } from '@/src/components/Dashboard/PinSuccessModal';
import dynamic from 'next/dynamic'

// UI-mapped Transaction Interface
interface UITransaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: string;
  status: string;
}

function Dashboard() {
  const router = useRouter();

  // Transaction States
  const [recentTxns, setRecentTxns] = useState<UITransaction[] | null>([]);
  const [loadingTxns, setLoadingTxns] = useState(true);

  const ProductTourDynamic = dynamic(() => import('@/src/components/ProductTour'), {
    ssr: false
  });

  const [modals, setModals] = useState({
    airtime: false,
    data: false,
    dataPin: false,
    cable: false,
    exam: false,
    electricity: false,
    convert: false,
    pin: false,
    pinSuccess: false,
  });

  // --- State ---
  const [showTour, setShowTour] = useState(false);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  // --- Helpers ---
  const toggleModal = (key: string, isOpen: boolean) => {
    setModals((prev) => ({ ...prev, [key]: isOpen }));
  };

  const handleTourComplete = () => {
    setShowTour(false);
    toggleModal('pin', true); // Prompt to set PIN after tour
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkPinStatus = async () => {
      try {
        const userData = await UseGetApi(`api/user`);
        // If user exists but has no PIN set, trigger the tour
        if (userData?.success && !userData?.data?.pin) {
          timer = setTimeout(() => {
            setShowTour(true);
          }, 1500);
        }
      } catch (error) {
        console.error("Error checking PIN status:", error);
      }
    };

    checkPinStatus();

    // Cleanup prevents memory leaks
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  // --- Fetch Recent Transactions ---
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      try {
        setLoadingTxns(true);

        const response = await UseGetApi(`api/transaction`, {
          limit: "3",
          page: meta.page
        });

        // Robustly locate the array regardless of nesting structure.
        // Prevents: "TypeError: rawData.map is not a function"
        let rawData: any[] = [];
        
        if (response?.data?.data && Array.isArray(response.data.data)) {
          // e.g. Axios response wrapping Backend { data: [...] }
          rawData = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          // e.g. Payload body { data: [...] } OR Backend array directly
          rawData = response.data;
        } else if (response?.data?.details && Array.isArray(response.data.details)) {
          // Admin endpoint format
          rawData = response.data.details;
        } else if (response?.data?.details?.transactions && Array.isArray(response.data.details.transactions)) {
          // Deep nested transactions
          rawData = response.data.details.transactions;
        } else if (Array.isArray(response)) {
          // Pure array fallback
          rawData = response;
        } else {
           console.warn("Unexpected transaction API response structure:", response);
        }

        // Map backend data to strictly typed UI format
        const mappedData: UITransaction[] = rawData.map((item: any) => ({
          id: item._id || item.id || Math.random().toString(), // Safe fallback for keys
          title: item?.category || item?.type || 'Transaction',
          date: formatDate(item?.createdAt || new Date().toISOString()),
          amount: `₦${Number(item?.amount || 0).toLocaleString()}`,
          // Determine credit/debit based on type or category logic
          type: item?.type === 'credit' || item?.category === 'deposit' ? 'credit' : 'debit',
          status: item?.status || 'Pending',
        }));

        setRecentTxns(mappedData);

      } catch (error) {
        console.error('Failed to load recent transactions', error);
        setRecentTxns([]); // Fail gracefully
      } finally {
        setLoadingTxns(false);
      }
    };

    fetchRecentTransactions();
  }, [meta.page]);


  return (
    <>
      <section className="min-h-screen bg-gray-50 pb-24">
        {showTour && (
          <ProductTourDynamic
            steps={tourSteps}
            onComplete={handleTourComplete}
            onSkip={handleTourComplete}
          />
        )}
        <motion.div
          className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 space-y-6"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05 } },
          }}
          initial="hidden"
          animate="visible"
        >
          <div id="wallet-card">
            <AccountDetails />
          </div>

          {/* 2. Quick Actions */}
          <div
            id="quick-actions"
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="grid grid-cols-3 gap-4">
              {quickActions?.map((action, idx) => (
                <Link href={action.to} key={idx} className="flex flex-col items-center gap-2 group">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-sm transition-transform group-active:scale-95 ${action.color}`}
                  >
                    {action.icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>


          {/* 3. Services Grid */}
          <div id="services-grid">
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-sm font-bold text-gray-800">My Services</h3>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-y-6 gap-x-2">
                {servicesAction?.map((item, idx) => (
                  <motion.button
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, scale: 0.95 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(item.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-primary flex items-center justify-center text-lg hover:bg-primary/10 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>


          <div id="transactions-list">
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-sm font-bold text-gray-800">Recent Transactions</h3>
              <Link href="/history" className="text-xs font-bold text-primary hover:text-primary/80">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {loadingTxns ? (
                // Loading State
                <div className="flex justify-center items-center py-8 bg-white rounded-xl border border-gray-100">
                  <FaSpinner className="animate-spin text-primary text-xl" />
                </div>
              ) : recentTxns?.length === 0 ? (
                // Empty State
                <div className="flex flex-col justify-center items-center py-8 bg-white rounded-xl border border-gray-100">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <FaHistory className="text-gray-300" />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">No recent transactions</p>
                </div>
              ) : (
                // Transaction List
                recentTxns?.map((txn) => (
                  <div
                    key={txn.id}
                    className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs ${
                          txn.type === 'credit'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {txn.type === 'credit' ? <FaArrowDown /> : <FaArrowUp />}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800 capitalize">{txn.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{txn.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`block text-xs font-bold ${
                          txn.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                        }`}
                      >
                        {txn.type === 'credit' ? '+' : '-'} {txn.amount}
                      </span>
                      <span
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md capitalize ${
                          txn.status.toLowerCase() === 'success' || txn.status.toLowerCase() === 'successful'
                            ? 'bg-green-50 text-green-600'
                            : txn.status.toLowerCase() === 'failed'
                            ? 'bg-red-50 text-red-600'
                            : 'bg-yellow-50 text-yellow-600'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </motion.div>
      </section>

      <PinModal
        isOpen={modals.pin}
        onClose={() => toggleModal('pin', false)}
        onSuccess={() => toggleModal('pinSuccess', true)}
      />

      <PinSuccessModal isOpen={modals.pinSuccess} onClose={() => toggleModal('pinSuccess', false)} />
    </>
  )
}

export default Dashboard;