'use client'

import { Button } from "./ui/button";
import { Star } from "lucide-react";

const CTA = () => {
  // Reusable 3D Button Class
  const btn3d =
    "border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all active:shadow-none active:translate-x-[4px] active:translate-y-[4px]";

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <div className="bg-slate-900 rounded-[2rem] p-12 md:p-24 text-center relative overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_#primary]">
          {/* Background decoration: Geometric shapes instead of blur */}
          <div className="absolute top-10 left-10 w-20 h-20 border-4 border-slate-700 rounded-full opacity-50"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary rounded-lg opacity-10 rotate-12"></div>
          <div className="absolute top-1/2 right-20 w-10 h-10 bg-white rotate-45 opacity-20"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-8 h-8 fill-yellow-400 text-black stroke-[1.5]"
                />
              ))}
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
              Experience the <br />
              {/* Pop Brush Highlight */}
              <span className="relative inline-block px-4 py-1 mt-2 transform -rotate-2">
                <span className="absolute inset-0 bg-primary border-2 border-white transform skew-x-[-10deg]"></span>
                <span className="relative z-10 text-black">Joy of Paying.</span>
              </span>
            </h2>

            <p className="text-xl text-slate-200 leading-relaxed font-medium">
              Join over 50,000+ Nigerians who have switched to Dolà for a
              seamless, stress-free payment experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                onClick={() => window.open("https://kitaodola.com/getstarted", "_blank")}
                className={`${btn3d} bg-white text-black h-16 px-10 rounded-xl text-lg font-black hover:bg-gray-100`}
              >
                Create Account
              </Button>
              <Button
                size="lg"
                className={`${btn3d} bg-transparent border-2 border-white text-white shadow-[4px_4px_0px_0px_#fff] h-16 px-10 rounded-xl text-lg font-black hover:bg-white hover:text-black`}
              >
                Download App
              </Button>
            </div>

            <p className="text-sm text-slate-400 pt-8 font-bold tracking-widest uppercase">
              No credit card required for signup
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
