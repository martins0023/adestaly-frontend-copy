"use client"

import { UserPlus, CreditCard, CheckCircle2 } from "lucide-react";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-yellow-50 overflow-hidden border-y-2 border-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            From zero to paid in <br/>
            {/* Marker Highlight */}
            <span className="relative inline-block px-2 mt-2">
                <span className="relative z-10 text-white">seconds</span>
                <div className="absolute inset-0 bg-black -rotate-2 z-0 transform skew-x-12"></div>
            </span>
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-2 bg-transparent border-t-4 border-dashed border-black z-0" />

          {/* Steps */}
          {[ 
            { icon: UserPlus, title: "Create Account", desc: "Sign up with just your details. No lengthy forms.", color: "bg-blue-300" },
            { icon: CreditCard, title: "Select Service", desc: "Choose what you want to pay for. Airtime, data, or bills.", color: "bg-orange-300" },
            { icon: CheckCircle2, title: "Instant Value", desc: "Receive your value instantly. No waiting periods.", color: "bg-green-300" }
          ].map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group z-10">
              {/* Icon Container with Pop Effect */}
              <div className="relative mb-8">
                  <div className={`absolute inset-0 ${step.color} rounded-2xl border-2 border-black translate-x-2 translate-y-2`} />
                  <div className="relative w-24 h-24 rounded-2xl bg-white border-2 border-black flex items-center justify-center hover:-translate-y-1 hover:-translate-x-1 transition-transform">
                      <step.icon className="w-10 h-10 text-black" strokeWidth={2.5} />
                      {/* Number Badge */}
                      <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black border-2 border-white shadow-md">
                        {i + 1}
                      </div>
                  </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase">{step.title}</h3>
              <p className="text-slate-800 font-medium leading-relaxed max-w-xs border-2 border-black bg-white p-4 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;