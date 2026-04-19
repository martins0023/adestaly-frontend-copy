"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { UseGetApi } from '@/src/config/Action';
import { FaArrowLeft, FaDownload, FaSpinner, FaCheckCircle, FaExclamationCircle, FaTimesCircle, FaRegCopy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function TransactionDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const id = searchParams.get('id');
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
       setError("No transaction ID provided.");
       setLoading(false);
       return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await UseGetApi(`api/bill/history/${id}`);
        if (res?.success) {
          setTransaction(res.details || res.data);
        } else {
          setError(res?.message || "Failed to load transaction details.");
        }
      } catch (err) {
        setError("Error fetching transaction details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDownloadPDF = () => {
    window.print();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  }

  const getStatusIcon = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'success' || s === 'successful' || s === 'delivered') return <FaCheckCircle className="text-green-500 text-3xl" />;
    if (s === 'failed') return <FaTimesCircle className="text-red-500 text-3xl" />;
    return <FaExclamationCircle className="text-yellow-500 text-3xl" />;
  };

  const getStatusColor = (status: string) => {
     const s = status?.toLowerCase();
     if (s === 'success' || s === 'successful' || s === 'delivered') return 'text-green-600 bg-green-50 border-green-200';
     if (s === 'failed') return 'text-red-600 bg-red-50 border-red-200';
     return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <FaExclamationCircle className="text-5xl text-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Transaction Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error}</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pb-20 pt-6 px-4 sm:px-6">
      
      {/* Dynamic styles to format printing neatly */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body, html { background: white !important; }
          .no-print { display: none !important; }
          .print-area { box-shadow: none !important; border: none !important; padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important; }
          #bottom-nav { display: none !important; }
        }
      `}} />

      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6 no-print">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <FaArrowLeft /> Back
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-orange-600 transition-colors">
            <FaDownload /> Save Receipt
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="print-area bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gray-50 px-6 py-8 text-center border-b border-gray-100">
            <div className="flex justify-center mb-3">
               {getStatusIcon(transaction.status)}
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">
               ₦{Number(transaction.amount || 0).toLocaleString()}
            </h2>
            <span className={\`inline-block px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border \${getStatusColor(transaction.status)}\`}>
               {transaction.status}
            </span>
          </div>

          {/* Details */}
          <div className="px-6 py-8">
            <div className="space-y-6">
               
               <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                 <span className="text-sm font-medium text-gray-500">Service</span>
                 <span className="text-sm font-bold text-gray-800 text-right capitalize max-w-[150px] truncate">{transaction.product_name || transaction.type || 'Service Payment'}</span>
               </div>

               <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                 <span className="text-sm font-medium text-gray-500">Beneficiary</span>
                 <span className="text-sm font-bold text-gray-800 text-right">{transaction.unique_element || 'N/A'}</span>
               </div>

               <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                 <span className="text-sm font-medium text-gray-500">Date & Time</span>
                 <span className="text-sm font-bold text-gray-800 text-right">
                    {new Date(transaction.createdAt || transaction.transaction_date).toLocaleString('en-US', {
                       month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'
                    })}
                 </span>
               </div>

               <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                 <span className="text-sm font-medium text-gray-500">Transaction ID</span>
                 <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-800 text-right">{transaction.transactionId || transaction.request_id || 'N/A'}</span>
                    <button onClick={() => copyToClipboard(transaction.transactionId || transaction.request_id)} className="text-gray-400 hover:text-orange-500 transition no-print"><FaRegCopy /></button>
                 </div>
               </div>

               {(transaction.token || transaction.unit) && (
                 <div className="flex flex-col gap-2 p-4 bg-orange-50 rounded-xl border border-orange-100">
                    {transaction.token && (
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-orange-600 uppercase">Token / PIN</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-gray-900">{transaction.token}</span>
                            <button onClick={() => copyToClipboard(transaction.token)} className="text-orange-400 hover:text-orange-600 transition no-print"><FaRegCopy /></button>
                          </div>
                       </div>
                    )}
                    {transaction.unit && (
                       <div className="flex justify-between items-center mt-2">
                          <span className="text-xs font-bold text-orange-600 uppercase">Units</span>
                          <span className="text-sm font-black text-gray-900">{transaction.unit}</span>
                       </div>
                    )}
                 </div>
               )}

            </div>
          </div>
          
          {/* Footer Branding for PDF */}
          <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
             <p className="text-xs font-semibold text-gray-400">Generated securely by the Subscription Platform</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function TransactionDetails() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    }>
      <TransactionDetailsContent />
    </React.Suspense>
  );
}
