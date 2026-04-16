"use client"

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Ensure this path is correct in your project
// import { transaction } from '../../assets';
import Modal from 'react-modal';
import { useRouter } from 'next/navigation';
import { AccountAndSupport, BillPaymentInfo, EssentialsInfo } from '@/src/constants/moreData';
import Link from 'next/link';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { useAppContext } from '@/src/context/AppContextProvider';

// Bind modal to app element for accessibility (Best Practice)
// Modal.setAppElement('#root');

const More = () => {
  const router = useRouter();

  const { logoutUser } = useAppContext();
  // -- State Management --
  // const [convertModalIsOpen, setConvertModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ pin: '' });
  const [isFormValid, setIsFormValid] = useState(false);

  // const openConvertModal = () => setConvertModalIsOpen(true);
  // const closeConvertModal = () => setConvertModalIsOpen(false);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   // Only allow numbers for PIN
  //   if (name === 'pin' && isNaN(value)) return;

  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // useEffect(() => {
  //   // Validation: PIN must be exactly 4 digits
  //   setIsFormValid(formData.pin.length === 4);
  // }, [formData.pin]);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   // Simulate API call
  //   setTimeout(() => {
  //     setLoading(false);
  //     closeConvertModal();
  //     alert('Request Submitted!');
  //   }, 2000);
  // };

  // -- Animation Variants --
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <section className="min-h-screen bg-gray-50 pb-24">
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="max-w-lg mx-auto"
      >
        {/* Header */}
        {/* <div className="bg-white px-5 py-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="text-gray-600 p-1 hover:bg-gray-100 rounded-full">
                    <FaChevronLeft />
                </button>
                <h1 className="text-lg font-bold text-gray-800">Services</h1>
            </div>
        </div> */}

        <div className="p-4 space-y-6 pt-2">
          {/* Group 1: Bill Payments */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Bill Payments</h3>
            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
              {
                BillPaymentInfo.map((bill, index) => (
                  <Link href={bill.link} key={index} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all duration-300 group-active:scale-90 ${bill.color}`}
                    >
                      {bill.icon}
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 text-center leading-tight group-hover:text-black transition-colors">
                      {bill.label}
                    </span>
                  </Link>
                ))
              }
            </div>
          </div>

          {/* Group 2: Essentials & Tools */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Essentials</h3>
            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
              {
                EssentialsInfo.map((bill, index) => (
                  <Link href={bill.link} key={index} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all duration-300 group-active:scale-90 ${bill.color}`}
                    >
                      {bill.icon}
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 text-center leading-tight group-hover:text-black transition-colors">
                      {bill.label}
                    </span>
                  </Link>
                ))
              }
            </div>
          </div>

          {/* Group 3: Account & Support */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Essentials</h3>
            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
              {
                AccountAndSupport.map((bill, index) => (
                  <Link href={bill.link} key={index} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all duration-300 group-active:scale-90 ${bill.color}`}
                    >
                      {bill.icon}
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 text-center leading-tight group-hover:text-black transition-colors">
                      {bill.label}
                    </span>
                  </Link>
                ))
              }
              <div onClick={() => logoutUser} className="flex flex-col items-center gap-2 group cursor-pointer">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-all duration-300 group-active:scale-90 text-red-600 bg-red-100`}
                >
                  <FaSignOutAlt />
                </div>
                <span className="text-[11px] font-medium text-gray-600 text-center leading-tight group-hover:text-black transition-colors">
                  Logout
                </span>
              </div>
            </div>
          </div>

          {/* Redundant Home Button (Optional - Kept per request but styled subtly) */}
          <div className="pt-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3.5 border border-primary/30 text-primary font-semibold rounded-xl text-sm hover:bg-primary/5 transition-colors"
            >
              RETURN HOME
            </button>
          </div>
        </div>
      </motion.div>

    </section >
  );
};

// --- Reusable Sub-Components for Clean Code ---


export default More;
