"use client"

import { Smartphone, Zap, Wifi, Tv, Droplets, MoreHorizontal } from "lucide-react";

const Services = () => {
  const services = [
    { title: "Airtime & Data", description: "Instant top-up for MTN, Glo, Airtel & 9mobile.", icon: Smartphone, color: "bg-orange-300" },
    { title: "Electricity", description: "Pay IKEDC, EKEDC, and other discos instantly.", icon: Zap, color: "bg-yellow-300" },
    { title: "Internet", description: "Spectranet, Smile, FiberOne subscriptions.", icon: Wifi, color: "bg-blue-300" },
    { title: "Cable TV", description: "DSTV, GOTV, Startimes renewals.", icon: Tv, color: "bg-purple-300" },
    { title: "Water Bills", description: "Water corporation payments made easy.", icon: Droplets, color: "bg-cyan-300" },
    { title: "Much More", description: "Giftcards, and Event tickets.", icon: MoreHorizontal, color: "bg-gray-300" },
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
              Everything you need. <br/>
              <span className="text-primary underline decoration-wavy decoration-4 underline-offset-4">One Platform.</span>
            </h2>
            <p className="text-xl font-medium text-slate-700">
              We've aggregated all your essential services into one seamless interface.
            </p>
          </div>
          <button className="hidden md:block px-6 py-3 border-2 border-black font-bold shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
            View full catalog
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="relative group cursor-pointer">
              {/* The "Pop" Offset Background */}
              <div className={`absolute inset-0 ${service.color} border-2 border-black rounded-2xl translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-200`} />
              
              {/* The Content Card */}
              <div className="relative h-full p-8 rounded-2xl bg-white border-2 border-black hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200">
                <div className="w-14 h-14 rounded-xl border-2 border-black bg-white flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#000]">
                  <service.icon className="w-7 h-7 text-black" />
                </div>
                
                <h3 className="text-2xl font-black mb-3 text-slate-900 uppercase tracking-tight">{service.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed border-t-2 border-dashed border-gray-200 pt-4">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;