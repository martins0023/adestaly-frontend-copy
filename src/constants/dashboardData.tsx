
import {
  FaEllipsisH,
  FaGraduationCap,
  FaLightbulb,
  FaReceipt,
  FaSearchDollar,
  FaSimCard,
  FaSimplybuilt,
  FaSpinner,
  FaHistory,
  FaTv,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaExchangeAlt,
  FaWallet,
} from 'react-icons/fa';

// --- UI Data ---

type quickActionsT = {
  icon: React.ReactNode,
  label: string,
  to: string,
  color: string,

}

export const quickActions: quickActionsT[] = [
  {
    icon: <FaPlus />,
    label: 'Add Money',
    to: '/',
    color: 'bg-primary text-white',
  },
  {
    icon: <FaExchangeAlt />,
    label: 'Swap Airtime',
    to: '/',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: <FaWallet />,
    label: 'Withdraw',
    to: '/',
    color: 'bg-orange-100 text-orange-600',
  },
];

export const servicesAction = [
  {
    icon: <FaSimCard />,
    label: 'Airtime',
    id: "/service/airtime",
  },
  {
    icon: <FaSimplybuilt />,
    label: 'Data',
    id: "/service/data",
  },
  {
    icon: <FaLightbulb />,
    label: 'Electricity',
    id: "/service/electricity",
  },
  {
    icon: <FaTv />,
    label: 'Cable TV',
    id: "/service/cable",
  },
  {
    icon: <FaGraduationCap />,
    label: 'Exam Pin',
    id: "/service/exam",
  },
  {
    icon: <FaReceipt />,
    label: 'Data Pin',
    id: "/data",
  },
  {
    icon: <FaSearchDollar />,
    label: 'Referrals',
    id: "/",
  },
  {
    icon: <FaEllipsisH />,
    label: 'More',
    id: "/"
  },
];

// --- Configuration ---
export const tourSteps = [
  {
    target: '#wallet-card',
    title: 'Your Wallet',
    content: 'This is your main balance. Click here to fund your wallet.',
  },
  {
    target: '#quick-actions',
    title: 'Quick Actions',
    content: 'Fast access to Add Money, Withdraw, or Convert Airtime.',
  },
  {
    target: '#services-grid',
    title: 'Services',
    content: 'Pay bills, buy data, and more from this menu.',
  },
];