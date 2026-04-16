import { Lightbulb, Smile, Target, Users } from "lucide-react";

export const values = [
  {
    title: "Simplicity",
    icon: Lightbulb,
    desc: "If it takes more than 3 clicks, we delete it. We fight complexity.",
    color: "bg-yellow-100",
  },
  {
    title: "Transparency",
    icon: Users,
    desc: "No hidden fees. No jargon. What you see is exactly what you pay.",
    color: "bg-blue-100",
  },
  {
    title: "Joy",
    icon: Smile,
    desc: "Payments shouldn't be boring. We add a little confetti to your day.",
    color: "bg-pink-100",
  },
  {
    title: "Reliability",
    icon: Target,
    desc: "We are obsessed with uptime. Your trust is our currency.",
    color: "bg-green-100",
  },
];

export const team = [
  {
    name: "Miracle Oladapo",
    role: "Software Engineer",
    color: "bg-blue-300",
  },
  {
    name: "Ayomikun Omotosho",
    role: "Software Engineer",
    color: "bg-pink-300",
  },
  { name: "Yusuf Ibrahim", role: "Lead Engineer", color: "bg-yellow-300" },
  { name: "Sarah Doe", role: "Design Lead", color: "bg-green-300" },
];

export const desktopLinks = [
  { label: "Services", href: "/#services" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Why Dola", href: "/#why-dola" },
];

export const mobileLinks = [
  ...desktopLinks,
  { label: "Contact", href: "/contact" },
  { label: "About", href: "/about" },
  { label: "Legal", href: "/legal" },
];

// --- Mock Data ---
export const initialNotifications = [
  {
    id: 1,
    title: 'System Maintenance',
    message: 'Scheduled maintenance is starting in 10 mins. Service may be intermittent.',
    type: 'warning',
    date: 'Just now',
    isRead: false,
  },
  {
    id: 2,
    title: 'Airtime Sent',
    message: 'You successfully sent ₦500 airtime to 08012345678.',
    type: 'success',
    date: '2 hrs ago',
    isRead: false,
  },
  {
    id: 3,
    title: 'Data Bundle Expiring',
    message: 'Your 50GB plan expires in 24 hours. Renew now to rollover data.',
    type: 'info',
    date: 'Yesterday',
    isRead: true,
  },
  {
    id: 4,
    title: 'Referral Bonus',
    message: 'You earned ₦200 from referring John Doe!',
    type: 'success',
    date: 'Oct 24',
    isRead: true,
  },
];

export const btn3d =
  "border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]";

export const inputStyle =
    "w-full px-4 py-4 bg-white border-2 border-black rounded-xl font-bold placeholder:text-slate-400 focus:outline-none focus:border-primary focus:shadow-[4px_4px_0px_0px_#000] focus:-translate-y-1 focus:-translate-x-1 transition-all duration-200";

