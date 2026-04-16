import { useState } from 'react';
import {
  FaCopy,
  FaHistory,
  FaEye,
  FaEyeSlash,
  FaWallet,
  FaCheckCircle,
  FaWifi,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AccountDetails = () => {

  // --- State ---
  const [showBalance, setShowBalance] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  // --- Mock Data Handling (Replace with real data) ---
  const walletBalance = '00.00';
  const accountNumber = '8100000009';
  const bankName = 'Kita Bank';

  // --- Handlers ---
  const toggleBalance = () => setShowBalance(!showBalance);

  const handleCopy = () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(accountNumber).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="w-full px-1 lg:px-0">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20, scale: 0.95 },
          visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: 'spring' } },
        }}
        className="relative w-full overflow-hidden rounded-[2rem] bg-primary text-white shadow-2xl shadow-primary/30 h-[240px] transition-all duration-300"
      >
        {/* --- Background Decor (Abstract Shapes) --- */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#4c6ef5] to-blue-900" />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none mix-blend-overlay" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-black/20 blur-2xl pointer-events-none" />

        {/* --- Card Overlay (Mesh Texture) --- */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        {/* --- Main Content --- */}
        <div className="relative z-10 p-7 h-full flex flex-col justify-between">
          {/* --- Header: Balance & Tier --- */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-blue-100/80 text-xs font-medium tracking-wide uppercase">
                  Total Balance
                </span>
                <button
                  onClick={toggleBalance}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
                >
                  {showBalance ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                </button>
              </div>

              <div className="h-10 flex items-center">
                <AnimatePresence mode="wait">
                  {showBalance ? (
                    <motion.h1
                      key="balance"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-3xl lg:text-4xl font-bold tracking-tight font-mono"
                    >
                      ₦{Number(walletBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </motion.h1>
                  ) : (
                    <motion.h1
                      key="hidden"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-3xl lg:text-4xl font-bold tracking-widest mt-2"
                    >
                      ••••••
                    </motion.h1>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Tier Badge */}
            <div className="glass-panel px-3 py-1.5 rounded-xl flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-md">
              <FaWifi className="rotate-90 text-green-300 text-xs" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                Tier 1
              </span>
            </div>
          </div>

          {/* --- Footer: Account Details & Actions --- */}
          <div className="flex justify-between items-end gap-4">
            {/* Account Info Box */}
            <button
              type="button"
              className="flex-1 bg-black/20 backdrop-blur-md border border-white/5 rounded-2xl p-3 flex items-center gap-3 hover:bg-black/30 transition-colors group cursor-pointer"
              onClick={handleCopy}
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-200 group-hover:scale-110 transition-transform">
                <FaWallet />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-blue-200 uppercase font-semibold tracking-wide mb-0.5">
                  {bankName}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm sm:text-base font-mono font-bold tracking-wider text-white truncate">
                    {accountNumber}
                  </p>
                  <div className="text-blue-300 group-hover:text-white transition-colors pl-2">
                    {isCopied ? <FaCheckCircle className="text-green-400" /> : <FaCopy />}
                  </div>
                </div>
              </div>
            </button>

            {/* History Action */}
            <button
              onClick={() => {}}
              className="flex flex-col items-center justify-center gap-1.5 min-w-[60px] group active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-primary transition-all shadow-lg">
                <FaHistory />
              </div>
              <span className="text-[10px] font-semibold text-blue-100 group-hover:text-white">
                History
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountDetails;
