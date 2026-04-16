"use client"

import NavHome from "@/src/components/NavHome";
import Footer from "@/src/components/Footer";
import { Button } from "@/src/components/ui/button"; 
import {
  Users,
  ArrowRight,
} from "lucide-react";
import { btn3d, values } from "@/src/constants";

const About = () => {

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavHome />

      <main className="grow pt-32">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Decorative Stars */}
            <div className="absolute top-0 left-10 animate-pulse hidden md:block">
              <svg
                width="40"
                height="40"
                viewBox="0 0 50 50"
                className="text-yellow-400 fill-current"
              >
                <path d="M25 0L31 19L50 25L31 31L25 50L19 31L0 25L19 19L25 0Z" />
              </svg>
            </div>

            <div className="inline-block mb-6 px-4 py-2 bg-black text-white rounded-lg border-2 border-black font-bold uppercase tracking-widest rotate-2">
              Since 2026
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[1.1]">
              The modern way to <br />
              <span className="relative inline-block px-2">
                <span className="relative z-10 text-primary">pay</span>
                {/* Marker Loop */}
                <svg
                  className="absolute top-0 left-0 w-[110%] h-[120%] -translate-x-2 -translate-y-1 z-0 pointer-events-none text-black opacity-100"
                  viewBox="0 0 200 60"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M10,30 Q50,5 90,30 T180,30 M10,30 Q50,55 90,30 T180,30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>{" "}
              <br />
              in Africa.
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
              Dolà is the lifestyle payment app designed for the modern African. 
              Manage your airtime, electricity, and utilities in one stunning, secure interface. We’ve removed the stress so you can focus on what matters. Fast, reliable, and built for you.
            </p>
          </div>
        </section>

        {/* The "Story" Image Section */}
        <section className="container mx-auto px-4 mb-24">
          <div className="relative max-w-5xl mx-auto">
            {/* Background Blobs */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary rounded-full border-2 border-black hidden md:block"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-400 rounded-full border-2 border-black hidden md:block"></div>

            {/* Main Image with Polaroid Effect */}
            <div className="relative z-10 bg-white p-4 pb-16 border-4 border-black shadow-[12px_12px_0px_0px_#000] rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="bg-slate-200 w-full h-100 md:h-125 border-2 border-black flex items-center justify-center overflow-hidden">
                {/* Placeholder for Team Image */}
                <div className="text-center opacity-50">
                  <Users className="w-20 h-20 mx-auto mb-4" />
                  <span className="font-black text-2xl uppercase">
                    The Team
                  </span>
                </div>
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="font-handwriting text-2xl font-black text-slate-800 rotate-1">
                  Your hustle pays the bills. We make the payment easy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="bg-slate-50 py-24 border-y-4 border-black">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
                  Our DNA
                </h2>
                <div className="h-2 w-32 bg-primary mt-4 border-2 border-black"></div>
              </div>
              <p className="text-lg font-bold text-slate-500 max-w-md text-right">
                These aren't just posters on a wall. This is how we code,
                design, and speak.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, idx) => (
                <div key={idx} className="group relative">
                  {/* Pop Effect Background */}
                  <div
                    className={`absolute inset-0 ${value.color} border-2 border-black rounded-2xl translate-x-3 translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform`}
                  />

                  <div className="relative bg-white border-2 border-black rounded-2xl p-8 h-full flex flex-col items-start hover:-translate-y-1 hover:-translate-x-1 transition-transform">
                    <div className="w-12 h-12 bg-black text-white rounded-lg flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                      <value.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3 uppercase">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 font-medium leading-snug">
                      {value.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-24 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Meet the Makers
            </h2>
            <div className="w-full max-w-xs mx-auto">
              <svg
                viewBox="0 0 100 20"
                className="w-full h-4 stroke-black stroke-4 fill-none"
              >
                <path d="M0,10 Q25,20 50,10 T100,10" />
              </svg>
            </div>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
            {team.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="relative mb-6">
                  <div
                    className={`absolute inset-0 ${member.color} rounded-full border-2 border-black translate-x-2 translate-y-2`}
                  />
                  <div className="relative w-48 h-48 rounded-full bg-slate-100 border-2 border-black overflow-hidden hover:-translate-y-1 hover:-translate-x-1 transition-transform">
                    
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <span className="font-black text-4xl text-slate-300">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase">
                  {member.name}
                </h3>
                <p className="text-primary font-bold">{member.role}</p>
              </div>
            ))}
          </div> */}
        </section>

        {/* Hiring CTA */}
        <section className="container mx-auto px-4 pb-24">
          <div className="bg-black text-white rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden border-4 border-black">
            {/* Abstract Decorators */}
            <div className="absolute top-10 left-10 text-primary animate-spin-slow">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="currentColor"
              >
                <path d="M30 0L35 25L60 30L35 35L30 60L25 35L0 30L25 25L30 0Z" />
              </svg>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Want to build with us?
              </h2>
              <p className="text-xl text-slate-300 mb-8 font-medium">
                We are always looking for people who are crazy enough to think
                they can change the financial world.
              </p>
              <div className="flex justify-center">
                <Button
                  className={`${btn3d} bg-white text-black h-16 px-10 rounded-xl text-lg font-black hover:bg-gray-100 flex items-center gap-2`}
                >
                  View Open Roles <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
