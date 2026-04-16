"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import {
  FaLock,
  FaShieldAlt,
  FaUser,
  FaChevronRight,
  FaCopy,
  FaShareAlt,
  FaCheckCircle,
  FaPen,
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { invite } from '@/public/images'; // Use absolute alias if configured
import axiosClient from '@/src/config/client';

// --- Types ---
type ProfileI = {
  _id: string;
  firstname: string;
  lastname: string;
  middlename?: string;
  phone: string;
  state: string;
  image: string;
  email: string;
};

// --- 1. Define the Fetcher ---
// This tells SWR how to actually get the data using your existing axios config
const fetcher = (url: string): Promise<ProfileI> =>
  axiosClient.get(url).then((res) => res.data?.details );

const ProfileDetails = () => {
  // --- 2. SWR Hook ---
  const { data: info, error, isLoading } = useSWR<ProfileI>('api/user', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    errorRetryCount: 2,
  });

  const [showToast, setShowToast] = useState(false);

  // Fallback ID if data isn't loaded yet to prevent "undefined" in URL
  const referralLink = `https://kitaodola.com/login/${info?._id || 'ref'}`;

  // --- Handlers ---
  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(referralLink).then(() => {
        triggerToast();
      });
    }
  };

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${info?.firstname || 'User'} invites you to Kitaodola`,
          text: 'Check out this amazing app for airtime and data!',
          url: referralLink,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      copyToClipboard();
    }
  };

  // --- Render Helpers ---
  const renderProfilePic = () => {
    if (info?.image) {
      return (
        <Image
          src={info.image}
          fill
          alt="Profile"
          className="object-cover" // Important for square aspect ratio
          sizes="112px"
        />
      );
    }
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
        <FaUser className="text-4xl" />
      </div>
    );
  };

  // --- Loading & Error States ---
  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Loading profile...</div>;

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <p className="text-red-500 mb-4">Failed to load profile details.</p>
      <Link href="/signin" className="text-primary font-bold underline">Try signing in again</Link>
    </div>
  );

  // --- Animations ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative overflow-x-hidden">
      {/* Top Background Element */}
      <div className="h-32 bg-primary/10 rounded-b-[3rem] absolute top-0 w-full z-0" />

      <motion.div
        className="relative z-10 max-w-lg mx-auto px-4 pt-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- Profile Header --- */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-28 h-28 relative rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
              {renderProfilePic()}
            </div>
            <Link
              href="/profile/update-profile"
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md hover:scale-110 transition-transform border-2 border-white"
            >
              <FaPen className="text-[10px]" />
            </Link>
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-gray-800">
              {info?.firstname} {info?.lastname}
            </h2>
            <p className="text-sm text-gray-500">{info?.email}</p>
          </div>
        </motion.div>

        {/* --- Security Section --- */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Security Settings</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <SettingsItem
              icon={<FaLock />}
              label="Change Password"
              to="/profile/change-password"
              color="bg-orange-100 text-orange-600"
            />
            <SettingsItem
              icon={<FaShieldAlt />}
              label="Transaction PIN"
              to="/profile/update-pin"
              color="bg-purple-100 text-purple-600"
            />
          </div>
        </motion.div>

        {/* --- Referral Section --- */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              {invite ? (
                <Image src={invite} alt="Invite" className="w-10 h-10 object-contain" />
              ) : (
                <FaShareAlt className="text-2xl text-primary" />
              )}
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-1">Invite Friends</h3>
            <p className="text-xs text-gray-500 mb-6 max-w-[240px] mx-auto leading-relaxed">
              Share your link with friends and earn rewards when they sign up.
            </p>

            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-1.5 flex items-center justify-between pl-4 mb-4">
              <span className="text-[11px] text-gray-600 font-medium truncate mr-2">
                {referralLink}
              </span>
              <button
                onClick={copyToClipboard}
                className="bg-white text-gray-700 hover:text-primary hover:border-primary border border-gray-200 shadow-sm px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 active:scale-95"
              >
                <FaCopy /> Copy
              </button>
            </div>

            <button
              onClick={handleShare}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <FaShareAlt /> Share Link
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* --- Toast Notification --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-24 left-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 whitespace-nowrap"
          >
            <FaCheckCircle className="text-green-400" />
            <span className="text-sm font-medium">Copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Reusable Settings Item ---
const SettingsItem = ({ icon, label, to, color }: { icon: React.ReactNode; label: string; to: string; color: string }) => (
  <Link href={to} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${color}`}>
        {icon}
      </div>
      <span className="text-sm font-bold text-gray-700">{label}</span>
    </div>
    <FaChevronRight className="text-gray-300 text-[10px] group-hover:text-primary group-hover:translate-x-1 transition-all" />
  </Link>
);

export default ProfileDetails;