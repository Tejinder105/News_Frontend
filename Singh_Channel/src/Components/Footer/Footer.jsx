import React from "react";
import { Link } from "react-router-dom";
import { footerData } from "../../Constants/FooterData";
import { Twitter, Instagram, Facebook, Youtube } from "lucide-react";
import Logo from "../Ui/Logo";

function Footer() {
  const { company, socialMedia, mainLinks = [], legal = [] } = footerData;

  const getIcon = (name, size = 20) => {
    switch (name) {
      case "Instagram": return <Instagram size={size} />;
      case "Twitter": case "X": return <Twitter size={size} />;
      case "YouTube": return <Youtube size={size} />;
      case "Facebook": return <Facebook size={size} />;
      default: return <div className="h-5 w-5 bg-gray-500" />;
    }
  };

  return (
    <footer className="w-full bg-slate-900 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* 1. LOGO ROW - Using Shared Logo Component */}
        <div className="mb-6">
          <Logo size="large" />
          <p className="mt-2 text-xs text-gray-400 max-w-md">
            {company.description}
          </p>
        </div>

        {/* 2. NAVIGATION ROW (Horizontal List) */}
        <div className="mb-8 border-b border-gray-700 pb-6">
          <nav className="flex flex-wrap gap-x-6 gap-y-3">
            {mainLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-bold text-gray-200 hover:text-white hover:underline transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* 3. SOCIALS ROW */}
        <div className="mb-8 flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-200">Follow Us on:</span>
          <div className="flex gap-4">
            {socialMedia.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="rounded-full bg-slate-800 p-2 text-white hover:bg-slate-700 hover:scale-110 transition-all"
                aria-label={social.name}
              >
                {getIcon(social.name, 18)}
              </a>
            ))}
          </div>
        </div>

        {/* 4. LEGAL & COPYRIGHT */}
        <div className="border-t border-gray-800 pt-6">
          {/* Legal Links Row */}
          <div className="mb-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-300">
            {legal.map(l => (
              <Link key={l.name} to={l.path} className="hover:text-white hover:underline">{l.name}</Link>
            ))}
            <span className="cursor-pointer hover:text-white hover:underline">Do not share or sell my info</span>
          </div>

          {/* Copyright Text */}
          <p className="text-xs text-gray-400">
            Copyright © {new Date().getFullYear()} {company.name}. The {company.name} is not responsible for the content of external sites.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
