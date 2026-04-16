"use client"

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { desktopLinks, mobileLinks } from "../constants";
import { readSessionPayload } from "../config/session";

const NavHome = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [auth, setAuth] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await readSessionPayload();
        setAuth(!!session);
      } catch (error) {
        setAuth(false);
      } finally {
        setMounted(true);
      }
    };

    checkAuth();
  }, []); // Added empty dependency array to prevent infinite loops

  // Neo-Brutalist Button Style Helper
  const buttonStyle = "border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white border-b-2 border-black py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">

          {/* Logo - Stamped Look */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-primary h-10 w-10 border-2 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-1 group-hover:shadow-none transition-all">
              <span className="text-white font-black text-xl">D</span>
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">
              Dolà
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-white border-2 border-black rounded-full px-6 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {desktopLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-bold text-slate-900 hover:text-primary px-4 py-2 transition-colors uppercase tracking-tight"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Buttons - Wrapped in hidden md:flex to fix layout distortion */}
          <div className="hidden md:flex items-center justify-end gap-4 min-w-[220px]">
            {mounted ? (
              auth ? (
                <Link href="/dashboard" className={`${buttonStyle} bg-primary text-black rounded-lg font-black py-2 px-6 hover:bg-primary/90 flex items-center`}>
                  GO TO DASHBOARD
                </Link>
              ) : (
                <>
                  <Link href="/login" className="font-bold text-slate-900 hover:bg-transparent hover:underline underline-offset-4 text-base px-2 py-2">
                    Sign In
                  </Link>
                  <Link href="/getstarted" className={`${buttonStyle} bg-primary text-black rounded-lg font-black py-2 px-6 hover:bg-primary/90 flex items-center`}>
                    Get Started
                  </Link>
                </>
              )
            ) : (
              // Invisible placeholder matching button height to prevent layout shift during load
              <div className="h-[44px]"></div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 border-2 border-black rounded-lg bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 transition-all"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b-2 border-black p-4 shadow-xl animate-in slide-in-from-top-5">
            <div className="flex flex-col space-y-4">
              {mobileLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-lg font-bold text-slate-900 py-3 border-b-2 border-dashed border-gray-200 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}

              <div className="flex flex-col gap-3 pt-4">
                {mounted && auth ? (
                  <Link href="/dashboard" className="w-full text-center border-2 border-black bg-primary text-black font-bold py-4 rounded-lg shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="w-full text-center border-2 border-black bg-white text-black font-bold py-4 rounded-lg shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
                      Sign In
                    </Link>
                    <Link href="/getstarted" className="w-full text-center border-2 border-black bg-primary text-black font-bold py-4 rounded-lg shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:shadow-none transition-all">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavHome;