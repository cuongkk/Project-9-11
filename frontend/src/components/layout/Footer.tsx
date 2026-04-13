"use client";

import { FaGlobe } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 dark:bg-black w-full py-16 px-8 mt-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-7xl mx-auto border-t border-slate-800 pt-12">
        <div>
          <span className="text-xl font-bold text-white mb-4 block font-headline">TravelKa</span>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">The Velocity Curator. Engineering travel for those who move fast and expect more.</p>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-primary transition-colors" href="#">
              <FaGlobe className="text-sm" />
            </a>
            <a className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-primary transition-colors" href="#">
              <span className="material-symbols-outlined text-sm">public</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-primary transition-colors" href="#">
              <span className="material-symbols-outlined text-sm">share</span>
            </a>
          </div>
        </div>
        <div>
          <h6 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Company</h6>
          <ul className="space-y-4">
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                About Us
              </a>
            </li>
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                Our Philosophy
              </a>
            </li>
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                Careers
              </a>
            </li>
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Products</h6>
          <ul className="space-y-4">
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                Private Tours
              </a>
            </li>
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                Luxury Combos
              </a>
            </li>
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                Expedition Gear
              </a>
            </li>
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                Gift Cards
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h6 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Support</h6>
          <ul className="space-y-4">
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                Help Center
              </a>
            </li>
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                Safety Info
              </a>
            </li>
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                Cancellation
              </a>
            </li>
            <li>
              <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-8 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-sm font-plus-jakarta leading-relaxed">© 2024 TravelKa. The Velocity Curator.</p>
        <div className="flex gap-8">
          <a className="text-slate-400 hover:text-white text-xs" href="#">
            Terms
          </a>
          <a className="text-slate-400 hover:text-white text-xs" href="#">
            Privacy
          </a>
          <a className="text-slate-400 hover:text-white text-xs" href="#">
            Cookies
          </a>
        </div>
      </div>
    </footer>
  );
};
