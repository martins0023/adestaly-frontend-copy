"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaPlus } from 'react-icons/fa';

const BalanceDashboard = () => {
  const [showBalance, setShowBalance] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full relative overflow-hidden rounded-xl shadow-md bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(255, 140, 0, 0.95) 0%, rgba(204, 85, 0, 0.95) 100%), url('/images/framewallet.png')`,
      }}
    >
      {/* --- Decorative Background Glows (Scaled down) --- */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-y-1/3 -translate-x-1/4"></div>

      <div className="relative z-10 p-4 sm:p-5 flex justify-between items-center gap-4">
        
        {/* --- Left: Balance Details --- */}
        <div className="flex flex-col gap-1">
          {/* Label & Toggle */}
          <div className="flex items-center gap-2">
            <p className="text-white/80 text-xs font-medium tracking-wide">
              Total Balance
            </p>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-white/70 hover:text-white transition-colors rounded-md p-0.5"
              aria-label={showBalance ? "Hide balance" : "Show balance"}
            >
              {showBalance ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
            </button>
          </div>

          {/* Amount Area */}
          <div className="flex items-baseline gap-1 text-white">
            <span className="text-xl font-semibold">₦</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {showBalance ? '0.00' : '••••'}
            </h1>
          </div>

          {/* Coming Soon Status (Subtle) */}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-white/80 text-[10px] font-medium tracking-wide">
              Features coming soon
            </span>
          </div>
        </div>

        {/* --- Right: Compact Action Button --- */}
        <div className="flex-shrink-0">
          <button
            disabled
            className="flex items-center justify-center gap-1.5 bg-white text-[#FF8C00] px-4 py-2 rounded-lg font-bold text-xs shadow-sm opacity-90 cursor-not-allowed hover:opacity-100 transition-all active:scale-[0.98]"
          >
            <FaPlus size={10} />
            <span>Fund</span>
          </button>
        </div>
        
      </div>
    </motion.div>
  );
};

export default BalanceDashboard;