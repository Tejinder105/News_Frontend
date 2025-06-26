import { Mail, MapPin, Phone } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-900 px-3 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <NavLink to="/" className="itmes-center group flex space-x-2">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-bold text-white transition-colors group-hover:text-sky-400 sm:block">
                SINGH CHANNEL
              </span>
            </NavLink>
            <p className="text-sm text-gray-300">
              Your trusted source for local news and events in Ratia and
              surrounding areas with latest updates from your community.
            </p>

            <div className="flex items-center">
              <span className="text-sm text-gray-300">Follow us:</span>
              <div className="ml-3 flex gap-3">
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-75"
                >
                  <img
                    src="/instagram.png"
                    alt="Instagram"
                    className="h-5 w-5"
                  />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-75"
                >
                  <img src="/twitter.png" alt="Twitter" className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-75"
                >
                  <img src="/youtube.png" alt="Youtube" className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-75"
                >
                  <img src="/facebook.png" alt="Facebook" className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="inline-block border-b border-sky-400 text-lg font-semibold">
              Contact Us
            </h4>
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="text-sky-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                Main Market, Ratia, Fatehabad District, Haryana-125051
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={18} className="text-sky-400" />
              <a
                href="tel:+919729035945"
                className="text-sm text-gray-300 transition-colors hover:text-sky-400"
              >
                +91 97290 35945
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={18} className="text-sky-400" />
              <a
                href="mailto:info@singhchannel.com"
                className="text-sm text-gray-300 transition-colors hover:text-sky-400"
              >
                info@singhchannel.com
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="inline-block border-b border-sky-400 text-lg font-semibold">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-sm transition-colors hover:text-sky-400 ${isActive ? "text-sky-400" : "text-gray-300"}`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `text-sm transition-colors hover:text-sky-400 ${isActive ? "text-sky-400" : "text-gray-300"}`
                  }
                >
                  About us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/privacy"
                  className={({ isActive }) =>
                    `text-sm transition-colors hover:text-sky-400 ${isActive ? "text-sky-400" : "text-gray-300"}`
                  }
                >
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/terms"
                  className={({ isActive }) =>
                    `text-sm transition-colors hover:text-sky-400 ${isActive ? "text-sky-400" : "text-gray-300"}`
                  }
                >
                  Terms of Service
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/advertise"
                  className={({ isActive }) =>
                    `text-sm transition-colors hover:text-sky-400 ${isActive ? "text-sky-400" : "text-gray-300"}`
                  }
                >
                  Advertise with us
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SINGH CHANNEL. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
