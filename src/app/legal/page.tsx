"use client"

import { useState } from "react";
import NavHome from "@/src/components/NavHome";
import Footer from "@/src/components/Footer";
import { Shield, FileText, Lock, Scale, Check } from "lucide-react";

// --- Types for Legal Sections ---
type SectionType = "privacy" | "terms" | "compliance";

const Legal = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("privacy");

  // Helper for scrolling to top when switching tabs
  const handleTabChange = (section: SectionType) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reusable Neo-Brutalist Tab Button
  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: SectionType;
    label: string;
    icon: any;
  }) => {
    const isActive = activeSection === id;
    return (
      <button
        onClick={() => handleTabChange(id)}
        className={`w-full flex items-center gap-3 px-6 py-4 border-2 border-black rounded-xl font-bold transition-all duration-200 
        ${
          isActive
            ? "bg-primary text-black shadow-[4px_4px_0px_0px_#000] translate-x-1"
            : "bg-white text-slate-600 hover:bg-slate-50 hover:shadow-[2px_2px_0px_0px_#ccc]"
        }`}
      >
        <Icon
          className={`w-5 h-5 ${isActive ? "text-black" : "text-slate-400"}`}
        />
        <span className="uppercase tracking-tight">{label}</span>
        {isActive && <Check className="ml-auto w-5 h-5" />}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavHome />

      <main className="grow pt-32 pb-24">
        {/* Header Section */}
        <section className="container mx-auto px-4 mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
            The{" "}
            <span className="underline decoration-wavy decoration-4 underline-offset-8 decoration-primary">
              Fine Print.
            </span>
          </h1>
          <p className="text-lg font-bold text-slate-500 max-w-2xl mx-auto">
            We believe in total transparency. Here is everything you need to
            know about how we operate, protect your data, and follow the rules.
          </p>
        </section>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
            {/* Left Column: Navigation (Sticky) */}
            <div className="lg:col-span-3">
              <div className="sticky top-32 space-y-4">
                <div className="bg-white border-2 border-black p-4 rounded-2xl shadow-[4px_4px_0px_0px_#000]">
                  <h3 className="font-black text-slate-900 uppercase mb-4 px-2">
                    Table of Contents
                  </h3>
                  <nav className="space-y-3">
                    <TabButton
                      id="privacy"
                      label="Privacy Policy"
                      icon={Lock}
                    />
                    <TabButton
                      id="terms"
                      label="Terms of Service"
                      icon={FileText}
                    />
                    <TabButton
                      id="compliance"
                      label="Compliance"
                      icon={Scale}
                    />
                  </nav>
                </div>

                <div className="p-4 bg-yellow-50 border-2 border-dashed border-black rounded-xl">
                  <p className="text-sm font-bold text-slate-700">
                    📅 Last Updated: <br /> January 16, 2026
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Content Area */}
            <div className="lg:col-span-9">
              <div className="relative">
                {/* "Folder" Look - Pop Background */}
                <div className="absolute inset-0 bg-white border-2 border-black rounded-3xl translate-x-2 translate-y-2 lg:translate-x-4 lg:translate-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]" />

                <div className="relative bg-white border-2 border-black rounded-3xl p-8 md:p-12 min-h-150">
                  {/* PRIVACY POLICY CONTENT */}
                  {activeSection === "privacy" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-4 mb-8 border-b-2 border-black pb-6">
                        <div className="w-16 h-16 bg-green-100 border-2 border-black rounded-xl flex items-center justify-center">
                          <Lock className="w-8 h-8 text-black" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-slate-900 uppercase">
                            Privacy Policy
                          </h2>
                          <p className="font-bold text-slate-500">
                            Your data, your rights.
                          </p>
                        </div>
                      </div>

                      <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:font-medium prose-p:text-slate-600">
                        <h3>1. Introduction</h3>
                        <p>
                          At Dolà ("we", "us", "our"), we take your privacy
                          seriously. We don't sell your data to advertisers, and
                          we only collect what is strictly necessary to process
                          your payments securely.
                        </p>

                        <h3>2. Information We Collect</h3>
                        <ul className="list-disc pl-5 space-y-2 marker:text-black marker:font-bold">
                          <li>
                            <strong>Personal Identification:</strong> Name,
                            phone number, and email address.
                          </li>
                          <li>
                            <strong>Transaction Data:</strong> Details of bills
                            you pay (amount, beneficiary).
                          </li>
                          <li>
                            <strong>Device Information:</strong> IP address and
                            device type for fraud prevention.
                          </li>
                        </ul>

                        <h3>3. How We Use Your Data</h3>
                        <p>
                          We use your data solely to:
                          <br /> a) Process your transactions with switch
                          providers.
                          <br /> b) Send you transaction receipts.
                          <br /> c) Detect and prevent fraud.
                        </p>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                          <h4 className="m-0 text-blue-900 font-bold uppercase text-sm">
                            Note on Payment Cards
                          </h4>
                          <p className="m-0 text-blue-800 text-sm">
                            We do <strong>not</strong> store your debit card PAN
                            or PIN. All card processing is handled by our
                            PCI-DSS compliant partner, Paystack/Flutterwave.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TERMS OF SERVICE CONTENT */}
                  {activeSection === "terms" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-4 mb-8 border-b-2 border-black pb-6">
                        <div className="w-16 h-16 bg-orange-100 border-2 border-black rounded-xl flex items-center justify-center">
                          <FileText className="w-8 h-8 text-black" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-slate-900 uppercase">
                            Terms of Service
                          </h2>
                          <p className="font-bold text-slate-500">
                            The rules of the game.
                          </p>
                        </div>
                      </div>

                      <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:font-medium prose-p:text-slate-600">
                        <h3>1. Acceptance of Terms</h3>
                        <p>
                          By downloading or using the Dolà app, you agree to be
                          bound by these terms. If you do not agree, please do
                          not use our services.
                        </p>

                        <h3>2. User Responsibilities</h3>
                        <p>
                          You are responsible for maintaining the
                          confidentiality of your account PIN and OTPs. You
                          agree not to share your login details with anyone.
                          Dolà will never ask for your PIN over the phone.
                        </p>

                        <h3>3. Transaction Limits</h3>
                        <p>
                          Transactions may be subject to limits imposed by
                          applicable regulations (CBN tiers) or our own risk
                          management policies.
                        </p>

                        <h3>4. Refunds and Disputes</h3>
                        <p>
                          If a bill payment fails but you are debited, we will
                          automatically reverse the funds to your wallet or bank
                          account within 24 hours. Complex disputes may take up
                          to 3 business days.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* COMPLIANCE CONTENT */}
                  {activeSection === "compliance" && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-4 mb-8 border-b-2 border-black pb-6">
                        <div className="w-16 h-16 bg-purple-100 border-2 border-black rounded-xl flex items-center justify-center">
                          <Scale className="w-8 h-8 text-black" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-slate-900 uppercase">
                            Compliance
                          </h2>
                          <p className="font-bold text-slate-500">
                            Licenses & Certifications.
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-50 border-2 border-black p-6 rounded-xl">
                          <Shield className="w-8 h-8 text-green-600 mb-2" />
                          <h4 className="font-black text-lg">
                            PCI-DSS Certified
                          </h4>
                          <p className="text-sm text-slate-600 font-bold">
                            Level 1 Compliant
                          </p>
                        </div>
                        <div className="bg-slate-50 border-2 border-black p-6 rounded-xl">
                          <Scale className="w-8 h-8 text-blue-600 mb-2" />
                          <h4 className="font-black text-lg">CBN Licensed</h4>
                          <p className="text-sm text-slate-600 font-bold">
                            Licensed PSSP
                          </p>
                        </div>
                      </div>

                      <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:font-medium prose-p:text-slate-600">
                        <h3>Regulatory Oversight</h3>
                        <p>
                          Dolà Technologies is duly registered with the
                          Corporate Affairs Commission (RC 123456). We operate
                          under the regulations of the Central Bank of Nigeria
                          (CBN).
                        </p>

                        <h3>KYC (Know Your Customer)</h3>
                        <p>
                          To comply with anti-money laundering (AML) laws, we
                          require varying levels of identity verification based
                          on your transaction volume.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 marker:text-black">
                          <li>
                            <strong>Tier 1:</strong> Phone number verification.
                          </li>
                          <li>
                            <strong>Tier 2:</strong> BVN Verification.
                          </li>
                          <li>
                            <strong>Tier 3:</strong> Government ID and Address
                            Verification.
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
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

export default Legal;
