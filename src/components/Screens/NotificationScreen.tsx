"use client";

import { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  FaCheckDouble,
  FaInfo,
  FaExclamation,
  FaCheck,
  FaBellSlash,
  FaTrashAlt,
} from 'react-icons/fa';

// Assuming initialNotifications is exported from your constants
import { initialNotifications } from '@/src/constants';

// --- TypeScript Interfaces ---
export interface INotification {
  id: string | number;
  title: string;
  message: string;
  date: string;
  type: 'warning' | 'success' | 'info' | string;
  isRead: boolean;
}

interface NotificationCardProps {
  note: INotification;
  getIcon: (type: string) => React.ReactNode;
  onDelete: (id: string | number) => void;
  variants: Variants;
}

export default function NotificationScreen() {
  // Cast initialNotifications to our interface to ensure type safety
  const [notifications, setNotifications] = useState<INotification[]>(
    initialNotifications as INotification[]
  );

  // --- Handlers ---
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string | number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    const baseClass =
      'w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm';
    switch (type) {
      case 'warning':
        return (
          <div className={`${baseClass} bg-orange-50 text-orange-500`}>
            <FaExclamation />
          </div>
        );
      case 'success':
        return (
          <div className={`${baseClass} bg-green-50 text-green-500`}>
            <FaCheck />
          </div>
        );
      default:
        return (
          <div className={`${baseClass} bg-blue-50 text-blue-500`}>
            <FaInfo />
          </div>
        );
    }
  };

  // --- Grouping Logic ---
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  // --- Animation Variants ---
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.95 },
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-6 py-5 border-b border-gray-100 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-inter font-bold tracking-tight text-gray-900">
            Notifications
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            You have {unreadNotifications.length} unread messages
          </p>
        </div>

        {unreadNotifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-bold text-[#FF8C00] bg-[#FF8C00]/5 px-3 py-1.5 rounded-full hover:bg-[#FF8C00]/10 transition-colors flex items-center gap-1.5"
          >
            <FaCheckDouble /> Mark all read
          </button>
        )}
      </div>

      {/* --- Content Area --- */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        {notifications.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
              <FaBellSlash className="text-3xl" />
            </div>
            <h3 className="text-gray-900 font-semibold text-lg">
              All caught up!
            </h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs">
              You have no new notifications at the moment.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* --- Section: New (Unread) --- */}
            <AnimatePresence mode="popLayout">
              {unreadNotifications.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                    New
                  </h2>
                  <div className="space-y-3">
                    {unreadNotifications.map((note) => (
                      <NotificationCard
                        key={note.id}
                        note={note}
                        getIcon={getIcon}
                        onDelete={deleteNotification}
                        variants={cardVariants}
                      />
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>

            {/* --- Section: Earlier (Read) --- */}
            <AnimatePresence mode="popLayout">
              {readNotifications.length > 0 && (
                <div>
                  {unreadNotifications.length > 0 && (
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">
                      Earlier
                    </h2>
                  )}
                  <div className="space-y-3">
                    {readNotifications.map((note) => (
                      <NotificationCard
                        key={note.id}
                        note={note}
                        getIcon={getIcon}
                        onDelete={deleteNotification}
                        variants={cardVariants}
                      />
                    ))}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Sub-Component for cleaner code ---
const NotificationCard = ({
  note,
  getIcon,
  onDelete,
  variants,
}: NotificationCardProps) => (
  <motion.div
    layout
    variants={variants}
    exit="exit"
    className={`group relative flex gap-4 p-5 rounded-2xl bg-white border transition-all duration-200 ${
      note.isRead
        ? 'border-gray-100'
        : 'border-blue-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
    }`}
  >
    {/* Icon */}
    <div className="flex-shrink-0 pt-1">{getIcon(note.type)}</div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start mb-1">
        <h3
          className={`text-sm truncate pr-6 ${
            note.isRead
              ? 'font-semibold text-gray-700'
              : 'font-bold text-gray-900'
          }`}
        >
          {note.title}
        </h3>
        <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
          {note.date}
        </span>
      </div>

      <p
        className={`text-xs leading-relaxed ${
          note.isRead ? 'text-gray-500' : 'text-gray-600 font-medium'
        }`}
      >
        {note.message}
      </p>
    </div>

    {/* Indicators & Actions */}
    <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
      {/* Unread Dot */}
      {!note.isRead && (
        <span className="w-2.5 h-2.5 bg-[#FF8C00] rounded-full ring-2 ring-white"></span>
      )}

      {/* Delete Button (Visible on Hover/Focus) */}
      <button
        onClick={() => onDelete(note.id)}
        className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        title="Remove notification"
        aria-label="Remove notification"
      >
        <FaTrashAlt className="text-xs" />
      </button>
    </div>
  </motion.div>
);