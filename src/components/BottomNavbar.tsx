"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaPlusCircle, FaUser, FaHistory } from 'react-icons/fa';

const BottomNavbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <FaHome /> },
    { name: 'More', path: '/more', icon: <FaPlusCircle /> },
    { name: 'History', path: '/history', icon: <FaHistory /> },
    { name: 'Profile', path: '/profile', icon: <FaUser /> }, // Swapped to FaUser for better context
  ];

  return (
    // Container: Fixed bottom, white bg with subtle border top for definition.
    // 'pb-safe' (if using tailwind-safe-area) or 'pb-4' ensures content isn't hidden behind iPhone home bars.
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 shadow-[0_-5px_10px_rgba(0,0,0,0.02)] z-50 pb-4 pt-2 h-[80px]">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname ? pathname === item.path || pathname.startsWith(item.path) : false;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`relative group flex flex-col items-center justify-center w-16 h-14 transition-all duration-300 ease-in-out ${
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {/* Icon: slight lift and scale on active state */}
              <div
                className={`text-xl mb-1 transition-transform duration-300 ${
                  isActive ? '-translate-y-1 scale-110' : ''
                }`}
              >
                {item.icon}
              </div>

              {/* Label: smaller text, hidden or subtle transition can be applied here */}
              <span
                className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-semibold' : ''}`}
              >
                {item.name}
              </span>

              {/* Active Indicator Dot: Modern touch for active state */}
              <span
                className={`absolute -bottom-2 w-1 h-1 rounded-full bg-current transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
export default BottomNavbar;