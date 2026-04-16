"use client"

import Image from "next/image";
import { Button } from "./ui/button";
import { ArrowRight, Apple, PlayCircle } from "lucide-react";
import heroImage from "../assets/hero-image.png";
// import { useNavigate } from "react-router-dom";

const Hero = () => {
  // const navigate = useNavigate();
  // const handleGetStarted = () => {
  //   navigate("https://dola.kitaodola.com");
  // }
  // Reusable 3D Button Class
  const btn3d =
    "border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]";

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-orange-50">
      {/* Decorative Squiggle Background */}
      <svg
        className="absolute top-20 right-0 w-64 h-64 text-yellow-200 opacity-50 -z-0"
        viewBox="0 0 100 100"
        fill="currentColor"
      >
        <path
          d="M20,50 Q40,10 60,50 T100,50"
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
        />
      </svg>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000] font-bold text-sm animate-fade-in">
              <span className="w-3 h-3 bg-red-500 border border-black rounded-full animate-pulse"></span>
              The #1 Lifestyle Payment App
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[1.1]">
              Pay Bills. <br />
              <span className="relative inline-block px-2">
                <span className="relative z-10">Find Joy.</span>
                {/* Marker Loop SVG */}
                <svg
                  className="absolute top-0 left-0 w-[110%] h-[120%] -translate-x-1 -translate-y-1 z-0 pointer-events-none text-primary opacity-80"
                  viewBox="0 0 200 60"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M10,30 Q50,5 90,30 T180,30 M10,30 Q50,55 90,30 T180,30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-xl text-slate-800 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              From airtime to electricity, handle all your lifestyle bills in
              one secure, beautiful app. No stress, just instant payments.
            </p>

            {/* Wavy Squiggle Separator */}
            <div className="w-32 h-4 mx-auto lg:mx-0">
              <svg
                viewBox="0 0 100 20"
                className="w-full h-full stroke-black stroke-[4] fill-none"
              >
                <path d="M0,10 Q25,20 50,10 T100,10" />
              </svg>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              {/* <a href="https://dola.kitaodola.com"> */}
                <Button
                  size="lg"
                  onClick={() => window.open("https://kitaodola.com", "_blank")}
                  className={`${btn3d} bg-primary text-black h-14 px-8 rounded-lg text-lg font-black`}
                >
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              {/* </a> */}
              <Button
                size="lg"
                className={`${btn3d} bg-white text-black h-14 px-8 rounded-lg text-lg font-black hover:bg-gray-50`}
              >
                View Services
              </Button>
            </div>

            {/* Store Buttons */}
            <div className="pt-8 mt-8 flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-900 transition-colors shadow-[4px_4px_0px_0px_#94a3b8]">
                  <Apple className="w-6 h-6" />
                  <div className="text-left leading-none">
                    <div className="text-[10px] uppercase font-bold">
                      Download on
                    </div>
                    <div className="font-bold text-sm">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg border-2 border-black hover:bg-gray-900 transition-colors shadow-[4px_4px_0px_0px_#94a3b8]">
                  <PlayCircle className="w-6 h-6" />
                  <div className="text-left leading-none">
                    <div className="text-[10px] uppercase font-bold">
                      Get it on
                    </div>
                    <div className="font-bold text-sm">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Image (Mockup with Pop Effect) */}
          <div className="relative lg:h-[700px] flex items-center justify-center">
            {/* Main Phone Container with Pop Effect */}
            <div className="relative group z-20">
              <div className="absolute inset-0 bg-black translate-x-4 translate-y-4 rounded-[3rem]" />
              <div className="relative w-full max-w-md mx-auto aspect-[9/16] bg-slate-100 rounded-[3rem] border-4 border-black overflow-hidden hover:-translate-y-2 hover:-translate-x-2 transition-transform duration-300">
                <Image
                  src={heroImage}
                  alt="Dola App"
                  className="w-full h-full object-cover absolute"
                  fill
                />
              </div>
            </div>

            {/* Floating Pop Cards */}
            <div className="absolute top-32 -left-12 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] z-30 animate-bounce duration-[3000ms]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 border-2 border-black rounded-lg flex items-center justify-center text-green-700 font-bold">
                  ⚡
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">
                    Electricity
                  </p>
                  <p className="text-sm font-black text-slate-900">Success</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-40 -right-5 bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#000] z-30 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 border-2 border-black rounded-lg flex items-center justify-center text-blue-700 font-bold">
                  📶
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">
                    Data
                  </p>
                  <p className="text-sm font-black text-slate-900">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
