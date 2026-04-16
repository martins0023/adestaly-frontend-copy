import BottomNavbar from "@/src/components/BottomNavbar";
import Navbar from "@/src/components/Navbar";
import type { Metadata } from "next";


export const metadata: Metadata = {
    title: "Dashboard | Dolà - Pay Bills, Airtime & Data",
    description: "Manage your subscriptions and bills efficiently.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            <Navbar />
            <div className="mt-17"></div>
            {children}
            <BottomNavbar />
        </div>
    );
}
