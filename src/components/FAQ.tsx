"use client"

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQ = () => {
  // State to track which accordion item is open
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Content sourced from Legal & Compliance Document
  const faqs = [
    {
      question: "Is my money safe with kìràkìtà ọ dola?",
      answer:
        "Yes. We do not hold your funds. All transactions are processed through licensed financial institutions and payment processors that are regulated by the Central Bank.", // [cite: 64, 65]
    },
    {
      question: "Do you store my card details?",
      answer:
        "No. Your card details are tokenized and processed by our secure payment partners (e.g., Paystack/Flutterwave). We never see your full card number or CVV.", // [cite: 66, 67, 68]
    },
    {
      question: "Can I get a refund if I pay the wrong electricity meter?",
      answer:
        "Unfortunately, once a utility payment is successful, it cannot be reversed by us because the value has already been delivered to the utility provider. Please double-check numbers before sending.", // [cite: 69, 70, 71]
    },
    {
      question: "How do I delete my account?",
      answer:
        "You can request account deletion via the 'Settings' tab in the app or by emailing support@kitaodola.com. Note that we may retain some transaction records for legal compliance.", // [cite: 72, 73, 74]
    },
  ];

  return (
    <section id="faq" className="py-24 bg-yellow-50 border-t-4 border-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_#000] mb-6">
            <HelpCircle className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Got Questions? <br />
            <span className="text-primary underline decoration-wavy decoration-4 underline-offset-4">
              We've got answers.
            </span>
          </h2>
          <p className="text-lg font-bold text-slate-600">
            Everything you need to know about safety, payments, and your
            account.
          </p>
        </div>

        {/* Accordion Grid */}
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-200 ${
                openIndex === index ? "mb-8" : ""
              }`}
            >
              {/* Pop Effect Background (Visible when open or hovered) */}
              <div
                className={`absolute inset-0 bg-black rounded-2xl translate-x-2 translate-y-2 transition-transform ${
                  openIndex === index
                    ? "translate-x-3 translate-y-3"
                    : "group-hover:translate-x-3 group-hover:translate-y-3"
                }`}
              />

              {/* Accordion Card */}
              <div
                onClick={() => toggleFAQ(index)}
                className={`relative bg-white border-2 border-black rounded-2xl overflow-hidden cursor-pointer transition-transform ${
                  openIndex === index
                    ? "-translate-y-1 -translate-x-1"
                    : "hover:-translate-y-1 hover:-translate-x-1"
                }`}
              >
                {/* Question Header */}
                <div
                  className={`p-6 flex items-center justify-between ${
                    openIndex === index ? "bg-primary text-black" : "bg-white"
                  }`}
                >
                  <h3 className="text-lg md:text-xl font-black pr-8 select-none">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <div className="w-8 h-8 bg-black text-white border-2 border-black rounded-lg flex items-center justify-center">
                        <Minus className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-white text-black border-2 border-black rounded-lg flex items-center justify-center">
                        <Plus className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Answer Body */}
                <div
                  className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                    openIndex === index
                      ? "max-h-96 border-t-2 border-black"
                      : "max-h-0"
                  }`}
                >
                  <p className="p-6 text-slate-700 font-medium text-lg leading-relaxed bg-white">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
