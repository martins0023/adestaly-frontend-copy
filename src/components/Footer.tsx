import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t-4 border-black pt-16 pb-10 relative overflow-hidden">
        {/* Decorative Squiggle at the top */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
            <svg className="w-full h-4 text-primary opacity-30" preserveAspectRatio="none" viewBox="0 0 100 20" fill="none">
                 <path d="M0,10 Q25,20 50,10 T100,10" stroke="currentColor" strokeWidth="4" />
            </svg>
        </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2 group cursor-pointer">
               {/* Stamped Logo */}
              <div className="bg-primary h-10 w-10 border-2 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0px_0px_#000] group-hover:translate-y-1 group-hover:shadow-none transition-all">
                <span className="text-white font-black text-xl">D</span>
              </div>
              <span className="font-black text-3xl tracking-tighter text-slate-900">
                Dolà
              </span>
            </div>
            
            <p className="text-slate-700 font-medium leading-relaxed max-w-sm border-l-4 border-primary pl-4">
              Reimagining the way you pay bills in Africa. Simple, fast, and reliable payments for the modern generation.
            </p>

            {/* Social Icons with Hard Shadows */}
            <div className="flex gap-4">
              {[Twitter, Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a 
                    key={i} 
                    href="#" 
                    className="w-12 h-12 border-2 border-black rounded-lg bg-white flex items-center justify-center text-black shadow-[4px_4px_0px_0px_#000] hover:bg-primary hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
                >
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section - Styled with Bold Headers */}
          <div>
            <h4 className="font-black text-slate-900 mb-6 text-lg uppercase tracking-tight">Product</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              {["Airtime & Data", "Bill Payments", "Virtual Cards", "Pricing"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-black hover:underline decoration-wavy decoration-2 underline-offset-4 transition-all flex items-center gap-2">
                        {item}
                    </a>
                  </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-6 text-lg uppercase tracking-tight">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              {["About Us", "Careers", "Blog", "Press Kit"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-black hover:underline decoration-wavy decoration-2 underline-offset-4 transition-all">
                        {item}
                    </a>
                  </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-6 text-lg uppercase tracking-tight">Legal</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              {["Privacy Policy", "Terms of Service", "Compliance"].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-black hover:underline decoration-wavy decoration-2 underline-offset-4 transition-all">
                        {item}
                    </a>
                  </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-2 border-black pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-bold text-slate-600">
          <p>© {currentYear} Dolà Technologies.</p>
          <div className="flex gap-6 items-center">
              <span className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full border border-black"></span>
                 Ibadan, Nigeria
              </span>
              <span className="w-1 h-4 bg-black/20 rounded-full"></span>
              <span>English (UK)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;