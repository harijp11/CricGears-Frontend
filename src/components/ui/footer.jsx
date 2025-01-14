import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer  className="bg-black text-white py-4">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">CricGears</h3>
            <p className="text-sm text-gray-400">© 2024 All Rights Reserved | VAT No:XXXXXXXXXX</p>
            <div className="mt-4 flex gap-4">
              <button className="p-2 hover:bg-gray-800 rounded-full">
                <Facebook className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-full">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-full">
                <Instagram className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Information</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>About</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Careers</li>
              <li>Support</li>
              <li>Returns</li>
              <li>Shipping</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Getting Started</li>
              <li>Pricing</li>
              <li>Resources</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}



