import React from 'react';
import { Globe, DollarSign } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedProductId } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#232f3e] text-white text-xs select-none">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="w-full py-3.5 bg-[#37475a] hover:bg-[#485769] text-center text-xs font-semibold text-gray-200 transition-colors focus:outline-none"
      >
        Back to top
      </button>

      {/* 4 Columns Links Section */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-sm text-white mb-3">Get to Know Us</h3>
          <ul className="space-y-2 text-gray-300 text-xs">
            <li className="hover:underline cursor-pointer">Careers</li>
            <li className="hover:underline cursor-pointer">SOA Newsletter</li>
            <li className="hover:underline cursor-pointer">About SOA</li>
            <li className="hover:underline cursor-pointer">Accessibility</li>
            <li className="hover:underline cursor-pointer">Sustainability</li>
            <li className="hover:underline cursor-pointer">SOA Devices</li>
            <li className="hover:underline cursor-pointer">SOA Science</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">Make Money with Us</h3>
          <ul className="space-y-2 text-gray-300 text-xs">
            <li className="hover:underline cursor-pointer">Sell products on SOA</li>
            <li className="hover:underline cursor-pointer">Sell on SOA Business</li>
            <li className="hover:underline cursor-pointer">Sell apps on SOA</li>
            <li className="hover:underline cursor-pointer">Become an Affiliate</li>
            <li className="hover:underline cursor-pointer">Advertise Your Products</li>
            <li className="hover:underline cursor-pointer">Self-Publish with Us</li>
            <li className="hover:underline cursor-pointer">Host an SOA Hub</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">SOA Payment Products</h3>
          <ul className="space-y-2 text-gray-300 text-xs">
            <li className="hover:underline cursor-pointer">SOA Prime Rewards Visa</li>
            <li className="hover:underline cursor-pointer">SOA Store Card</li>
            <li className="hover:underline cursor-pointer">Shop with Points</li>
            <li className="hover:underline cursor-pointer">Reload Your Balance</li>
            <li className="hover:underline cursor-pointer">SOA Currency Converter</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-sm text-white mb-3">Let Us Help You</h3>
          <ul className="space-y-2 text-gray-300 text-xs">
            <li
              onClick={() => {
                setActiveView('orders');
                scrollToTop();
              }}
              className="hover:underline cursor-pointer text-amber-300 font-semibold"
            >
              Your Orders &amp; Account
            </li>
            <li className="hover:underline cursor-pointer">Shipping Rates &amp; Policies</li>
            <li className="hover:underline cursor-pointer">Returns &amp; Replacements</li>
            <li className="hover:underline cursor-pointer">Manage Your Content and Devices</li>
            <li className="hover:underline cursor-pointer">Recalls and Product Safety Alerts</li>
            <li className="hover:underline cursor-pointer">Help &amp; Customer Service</li>
          </ul>
        </div>
      </div>

      {/* Middle Brand Selector Bar */}
      <div className="border-t border-[#3a4553] py-6">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          {/* Logo */}
          <button onClick={() => { setActiveView('home'); setSelectedProductId(null); scrollToTop(); }} className="flex items-center gap-2.5 p-1 rounded hover:opacity-90 transition group"><img src="/assets/logo.png" alt="SOA TRACEABLE FOODS Icon" className="h-9 w-9 object-contain rounded-xl shadow-sm group-hover:scale-105 transition" /><div className="flex flex-col items-start text-left leading-tight"><span className="font-extrabold tracking-wider text-lg text-white group-hover:text-amber-400 transition">SOA</span><span className="text-[11px] font-medium tracking-widest text-amber-200/90 uppercase">Traceable Foods</span></div></button>

          <div className="flex items-center gap-3 text-xs">
            <div className="border border-gray-500 rounded px-3 py-1.5 flex items-center gap-1.5 hover:border-white cursor-pointer">
              <Globe className="w-3.5 h-3.5" />
              <span>English</span>
            </div>
            <div className="border border-gray-500 rounded px-3 py-1.5 flex items-center gap-1.5 hover:border-white cursor-pointer">
              <span className="font-bold text-amber-400 text-sm">৳</span>
              <span>BDT - বাংলাদেশী টাকা</span>
            </div>
            <div className="border border-gray-500 rounded px-3 py-1.5 flex items-center gap-1.5 hover:border-white cursor-pointer">
              <span>🇧🇩 Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Services & Copyright */}
      <div className="bg-[#131a22] py-8 text-[11px] text-gray-400">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 pb-6 border-b border-gray-800">
          <div>
            <h4 className="text-gray-200 font-bold">SOA Music</h4>
            <p className="text-gray-400">Stream millions of songs</p>
          </div>
          <div>
            <h4 className="text-gray-200 font-bold">SOA Web Services</h4>
            <p className="text-gray-400">Scalable Cloud Computing Services</p>
          </div>
          <div>
            <h4 className="text-gray-200 font-bold">Goodreads</h4>
            <p className="text-gray-400">Book reviews &amp; recommendations</p>
          </div>
          <div>
            <h4 className="text-gray-200 font-bold">IMDb</h4>
            <p className="text-gray-400">Movies, TV &amp; Celebrities</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-6 text-center space-y-2">
          <div className="flex flex-wrap justify-center gap-4 text-gray-300">
            <span className="hover:underline cursor-pointer">Conditions of Use</span>
            <span className="hover:underline cursor-pointer">Privacy Notice</span>
            <span className="hover:underline cursor-pointer">Consumer Health Data Privacy Disclosure</span>
            <span className="hover:underline cursor-pointer">Your Ads Privacy Choices</span>
          </div>
          <p className="text-gray-400">
            &copy; 1996-{new Date().getFullYear()}, SOA, Inc. or its affiliates. (Interactive Educational Prototype)
          </p>
        </div>
      </div>
    </footer>
  );
};
