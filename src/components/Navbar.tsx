"use client"

import { useState, useEffect, useLayoutEffect } from 'react';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAppContext } from '../context/AppContextProvider';

import { readSessionPayload, SessionPayload } from '../config/session';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const { logoutUser } = useAppContext();
  const [userInfo, setUserInfo] = useState<SessionPayload | null>(null)

  useLayoutEffect(() => {
    const getUserInfo = async() => {
      const info = await readSessionPayload()
      setUserInfo(info)
    }

    getUserInfo()
  }, [])

  // Normalize user data safely
  // const userData = user?._doc || user;
  // const firstName = userData?.firstname || 'User';

  // --- Dynamic Greeting Logic ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    else if (hour < 18) return 'Good Afternoon';
    else return 'Good Evening';
  };
  const [greeting] = useState(getGreeting());

  // --- Helper: Get Initials for Fallback Avatar ---
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[70px]">
          {/* --- LEFT SECTION: PROFILE --- */}
          <Link
            href="/profile"
            className="flex items-center gap-3 group"
            onClick={() => window.scrollTo(0, 0)}
          >
            {/* Avatar Container */}
            <div className="relative">
              {userInfo?.image ? (
                <Image
                  src={userInfo.image}
                  width={40}
                  height={40}
                  objectFit='contain'
                  alt="Profile"
                  className="w-10 h-10 object-cover rounded-full border border-gray-200 shadow-sm group-hover:border-primary transition-colors"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold text-lg border border-gray-200 group-hover:bg-primary/10 transition-colors">
                  {getInitials(userInfo?.firstName ?? "")}
                </div>
              )}

              {/* Verification Status Badge (Absolute Positioned on Avatar) */}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[2px]">
                {userInfo?.isVerified ? (
                  <FaCheckCircle className="text-blue-500 w-3 h-3" />
                ) : (
                  <FaExclamationCircle className="text-red-500 w-3 h-3" />
                )}
              </div>
            </div>

            {/* Text Info */}
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wide leading-tight">
                {greeting}
              </span>
              <h1 className="text-sm font-bold text-gray-800 truncate max-w-[150px] leading-tight group-hover:text-primary transition-colors">
                {userInfo?.firstName}
              </h1>
            </div>
          </Link>

          {/* --- RIGHT SECTION: ACTIONS --- */}
          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <Link
              href="/notifications"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-primary"
            >
              <FaBell className="w-5 h-5" />
              {/* Red Dot for unread status (Visual cue) */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Link>

            {/* Separator Line */}
            <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>

            {/* Logout Button */}
            <button
              onClick={logoutUser}
              title="Logout"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <span className="hidden sm:block">Logout</span>
              <FaSignOutAlt className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
