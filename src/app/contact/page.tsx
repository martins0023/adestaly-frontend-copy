"use client"

import React, { useState } from "react";
import NavHome from "@/src/components/NavHome";
import Footer from "@/src/components/Footer";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/src/components/ui/button"; 
import { btn3d, inputStyle } from "@/src/constants";

const Contact = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission logic here
    console.log("Form Submitted", formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavHome />

      <main className="grow pt-32 pb-20">
        {/* Header Section */}
        <section className="container mx-auto px-4 mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6">
            Holla at <br />
            <span className="relative inline-block px-4">
              <span className="relative z-10 text-primary">Dolà.</span>
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
            </span>
          </h1>
          <p className="text-xl font-bold text-slate-500 max-w-2xl mx-auto">
            Got a question? Found a bug? Or just want to say hi? <br />
            We’re all ears (and keyboards).
          </p>
        </section>

        {/* Decorative Divider */}
        <div className="w-full max-w-xs mx-auto mb-16 opacity-20">
          <svg
            viewBox="0 0 100 20"
            className="w-full h-4 stroke-black stroke-4 fill-none"
          >
            <path d="M0,10 Q25,20 50,10 T100,10" />
          </svg>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
            {/* Left Column: Contact Info Cards */}
            <div className="lg:col-span-5 space-y-8">
              {/* Info Card 1: Support */}
              <div className="group relative">
                <div className="absolute inset-0 bg-blue-300 rounded-2xl border-2 border-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                <div className="relative bg-white border-2 border-black rounded-2xl p-8">
                  <div className="w-12 h-12 bg-blue-100 border-2 border-black rounded-lg flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-2xl font-black mb-2 uppercase">
                    Chat to Support
                  </h3>
                  <p className="text-slate-600 font-medium mb-4">
                    We're here to help with any account issues.
                  </p>
                  <a
                    href="mailto:hello@kitaodola.com"
                    className="font-bold text-primary hover:underline decoration-wavy decoration-2 underline-offset-4 text-lg"
                  >
                    hello@kitaodola.com
                  </a>
                </div>
              </div>

              {/* Info Card 2: Visit */}
              <div className="group relative">
                <div className="absolute inset-0 bg-orange-300 rounded-2xl border-2 border-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                <div className="relative bg-white border-2 border-black rounded-2xl p-8">
                  <div className="w-12 h-12 bg-orange-100 border-2 border-black rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-2xl font-black mb-2 uppercase">
                    Visit HQ
                  </h3>
                  <p className="text-slate-600 font-medium mb-4">
                    Come say hello at our office.
                  </p>
                  <p className="font-bold text-slate-900 text-lg">
                    Ibadan,
                    <br />
                    Nigeria.
                  </p>
                </div>
              </div>

              {/* Info Card 3: Call */}
              <div className="group relative">
                <div className="absolute inset-0 bg-green-300 rounded-2xl border-2 border-black translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                <div className="relative bg-white border-2 border-black rounded-2xl p-8">
                  <div className="w-12 h-12 bg-green-100 border-2 border-black rounded-lg flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-2xl font-black mb-2 uppercase">
                    Call Us
                  </h3>
                  <p className="text-slate-600 font-medium mb-4">
                    Mon-Fri from 8am to 5pm.
                  </p>
                  <a
                    href="tel:+2348000000000"
                    className="font-bold text-slate-900 hover:text-primary transition-colors text-lg"
                  >
                    +234 800 000 0000
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="relative">
                {/* Background Decorations */}
                <div className="absolute -top-10 -right-10 text-yellow-300 animate-spin-slow opacity-50 hidden lg:block">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M50 0L61.2257 38.7743L100 50L61.2257 61.2257L50 100L38.7743 61.2257L0 50L38.7743 38.7743L50 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                {/* Form Container */}
                <div className="relative z-10 bg-slate-50 border-4 border-black rounded-[2.5rem] p-8 md:p-12 shadow-[8px_8px_0px_0px_#000]">
                  <div className="flex items-center gap-3 mb-8">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl font-black text-slate-900 uppercase">
                      Send a Message
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-black uppercase tracking-wider text-slate-700"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className={inputStyle}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-black uppercase tracking-wider text-slate-700"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className={inputStyle}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="subject"
                        className="text-sm font-black uppercase tracking-wider text-slate-700"
                      >
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange} // Adjusted type compatibility in real implementation
                        className={`${inputStyle} appearance-none`}
                      >
                        <option value="">Select a topic...</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Issue</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-black uppercase tracking-wider text-slate-700"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell us what's on your mind..."
                        value={formData.message}
                        onChange={handleChange}
                        className={inputStyle}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className={`${btn3d} bg-primary text-black mt-4 hover:bg-primary/90`}
                    >
                      Send Message <Send className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
