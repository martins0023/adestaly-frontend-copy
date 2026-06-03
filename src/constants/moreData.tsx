import {
    FaGraduationCap,
    FaLightbulb,
    FaReceipt,
    FaSimCard,
    FaSimplybuilt,
    FaSwift,
    FaTv,
    FaHistory,
    FaMoneyBill,
    FaGift,
    FaMoneyBillWaveAlt,
    FaUser, // Changed from FaPersonBooth for consistency
    FaHeadphones,
    FaRegBell,
    FaPhone,
    FaSignOutAlt,
    FaTimes,
    FaPlane,
} from 'react-icons/fa';

export const BillPaymentInfo = [
    {
        icon: <FaSimCard />,
        color: "text-orange-500 bg-orange-50",
        label: "Airtime",
        link: "/service/airtime"
    },
    {
        icon: <FaSimplybuilt />,
        color: "text-emerald-500 bg-emerald-50",
        label: "Data",
        link: "/service/data",
    },
    {
        icon: <FaLightbulb />,
        color: "text-purple-500 bg-purple-50",
        label: "Electricity",
        link: "/service/electricity",
    },
    {
        icon: < FaTv />,
        color: "text-sky-500 bg-sky-50",
        label: "Cable TV",
        link: "/service/cable",
    },
    {
        icon: <FaGraduationCap />,
        color: "text-indigo-500 bg-indigo-50",
        label: "School Fees",
        link: "/service/school-fees"
    },
]

export const EssentialsInfo = [
    {
        icon: < FaSwift />,
        color: "text-red-500 bg-red-50",
        label: "Swap Airtime",
        link: "/",
    },
    {
        icon: <FaGraduationCap />,
        color: "text-indigo-500 bg-indigo-50",
        label: "Exam Pin",
        link: "/service/exam",
    },
    {
        icon: <FaPlane />,
        color: "text-blue-500 bg-blue-50",
        label: "Flights",
        link: "/service/flights",
    },
    {
        icon: <FaGift />,
        color: "text-amber-500 bg-amber-50",
        label: "Gift Cards",
        link: "/service/giftcards",
    },
]

export const AccountAndSupport = [
    {
        icon: <FaHeadphones />,
        color: "text-pink-600 bg-pink-50",
        label: "Become Agent",
        link: "/",
    },
    {
        icon: <FaGift />,
        color: "text-cyan-500 bg-cyan-50",
        label: "Referrals",
        link: "/",
    },
    {
        icon: <FaHistory />,
        color: "text-blue-600 bg-blue-50",
        label: "History",
        link: "/history",
    },
    {
        icon: <FaUser />,
        color: "text-lime-600 bg-lime-50",
        label: "Profile",
        link: "/profile",
    },
    {
        icon: < FaMoneyBillWaveAlt />,
        color: "text-fuchsia-500 bg-fuchsia-50",
        label: "Pricing",
        link: "/pricing",
    },
    {
        icon: <FaRegBell />,
        color: "text-teal-500 bg-teal-50",
        label: "Notices",
        link: "/notifications",
    },
    {
        icon: <FaPhone />,
        color: "text-rose-500 bg-rose-50",
        label: "Contact",
        link: "/",
    },
]