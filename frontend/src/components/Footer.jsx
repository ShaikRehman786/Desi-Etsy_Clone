// src/components/Footer.jsx
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#f9f5f0] text-gray-800 py-8 border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & About */}
          <div>
            <h2 className="text-2xl font-bold text-orange-600">Desi-Etsy</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your go-to marketplace for handmade, vintage, and culturally-rooted Desi crafts and products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="text-sm space-y-1">
              <li><a href="/shop" className="hover:underline">Shop</a></li>
              <li><a href="/about" className="hover:underline">About Us</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
              <li><a href="/faq" className="hover:underline">FAQs</a></li>
            </ul>
          </div>

          {/* Seller Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Sell With Us</h3>
            <ul className="text-sm space-y-1">
              <li><a href="/seller/signup" className="hover:underline">Become a Seller</a></li>
              <li><a href="/seller/guide" className="hover:underline">Seller Guide</a></li>
              <li><a href="/policies" className="hover:underline">Policies</a></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Connect</h3>
            <div className="flex space-x-4 mb-2">
              <a href="#" className="text-orange-600 hover:text-orange-800" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-orange-600 hover:text-orange-800" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-orange-600 hover:text-orange-800" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
            </div>
            <p className="text-sm text-gray-600">Email: support@desi-etsy.com</p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t pt-4 text-center text-xs text-gray-500">
          &copy; 2025 Desi-Etsy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
