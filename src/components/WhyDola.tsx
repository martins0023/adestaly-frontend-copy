"use client"

import { ShieldCheck, Zap, HeartHandshake, Gauge } from "lucide-react";

const WhyDola = () => {
  return (
    <section id="why-dola" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Built for modern <br/> lifestyles.
          </h2>
          <div className="h-2 w-24 bg-primary mx-auto my-6 border-2 border-black"></div>
          <p className="text-lg font-bold text-slate-700">
            We don't just process payments; we engineer reliability.
          </p>
        </div>

        {/* Bento Grid Layout - Neo Brutalist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Large Card 1 */}
          <div className="md:col-span-2 bg-black rounded-3xl p-10 flex flex-col justify-between relative overflow-hidden group border-2 border-black shadow-[6px_6px_0px_0px_#94a3b8]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[80px] opacity-20" />
            <div className="relative z-10">
                <div className="w-14 h-14 bg-white border-2 border-white rounded-xl flex items-center justify-center mb-6 text-black">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 uppercase">Bank-Grade Security</h3>
                <p className="text-slate-300 text-lg font-medium leading-relaxed max-w-md">
                    We use 256-bit encryption and comply with PCI-DSS standards. Your money is safer than under your mattress.
                </p>
            </div>
          </div>

          {/* Tall Card */}
          <div className="bg-white rounded-3xl p-8 border-2 border-black shadow-[6px_6px_0px_0px_#000] flex flex-col md:row-span-2 hover:-translate-y-1 transition-transform">
            <div className="w-14 h-14 bg-orange-300 border-2 border-black rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-black w-8 h-8" fill="currentColor" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase">Speed of Light</h3>
            <p className="text-slate-700 font-medium flex-grow">
                Transactions process in milliseconds. We've optimized our gateways to ensure you never get stuck on "Pending".
            </p>
            <div className="mt-8 h-32 bg-gray-50 rounded-2xl border-2 border-black flex items-center justify-center relative overflow-hidden">
                <span className="font-mono text-3xl font-black text-primary">0.4s avg</span>
            </div>
          </div>

          {/* Medium Card (Primary Color) */}
          <div className="bg-primary rounded-3xl p-10 flex flex-col justify-between text-black border-2 border-black shadow-[6px_6px_0px_0px_#000]">
             <div>
                <HeartHandshake className="w-12 h-12 mb-6" strokeWidth={2} />
                <h3 className="text-2xl font-black mb-2 uppercase">24/7 Support</h3>
                <p className="font-bold">Real humans. No bots. Anytime.</p>
             </div>
          </div>

           {/* Medium Card */}
           <div className="bg-blue-50 rounded-3xl p-10 border-2 border-black shadow-[6px_6px_0px_0px_#000]">
             <div>
                <Gauge className="w-12 h-12 mb-6 text-black" />
                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase">99.9% Uptime</h3>
                <p className="text-slate-700 font-bold">Reliability you can bank on.</p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyDola;