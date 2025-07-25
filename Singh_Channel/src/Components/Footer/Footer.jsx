import { Mail, MapPin, Phone, ArrowUp } from "lucide-react";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { footerData } from "../../Constants/FooterData";

const FooterSection = ({ title, children, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    <h4 className="inline-block border-b-2 border-sky-400 pb-2 text-lg font-semibold text-white">
      {title}
    </h4>
    {children}
  </div>
);

const ContactItem = ({ icon: Icon, children, href, type = "link" }) => (
  <div className="group flex items-start space-x-3">
    <Icon
      size={18}
      className="mt-0.5 flex-shrink-0 text-sky-400 transition-transform group-hover:scale-110"
    />
    {type === "link" ? (
      <a
        href={href}
        className="flex-1 text-sm text-gray-300 transition-colors hover:text-sky-400"
      >
        {children}
      </a>
    ) : (
      <p className="flex-1 text-sm text-gray-300">{children}</p>
    )}
  </div>
);

const SocialLink = ({ social }) => (
  <a
    href={social.url}
    target="_blank"
    rel="noopener noreferrer"
    className={`group transition-all duration-200 hover:scale-110 ${social.color}`}
    aria-label={social.name}
  >
    <img
      src={social.icon}
      alt={social.name}
      className="h-6 w-6 transition-transform duration-200 group-hover:scale-110"
    />
  </a>
);

function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { company, contact, socialMedia, quickLinks, categories } = footerData;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-slate-900 text-white">
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-6 bottom-6 z-50 rounded-full bg-sky-500 p-3 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-sky-600"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4 lg:col-span-2">
            <NavLink to="/" className="group flex items-center space-x-2">
              <img
                src={company.logo}
                alt="Logo"
                className="h-8 w-8 rounded-full object-cover shadow-lg transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-2xl font-bold text-white transition-colors group-hover:text-sky-400 sm:block">
                {company.name}
              </span>
            </NavLink>

            <p className="max-w-md text-sm leading-relaxed text-gray-300">
              {company.description}
            </p>

            {/* Social Links */}
            <div className="space-y-3">
              <h5 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
                Follow Us
              </h5>
              <div className="flex gap-4">
                {socialMedia.map((social, index) => (
                  <SocialLink key={index} social={social} />
                ))}
              </div>
            </div>
          </div>
          {/* Contact Info */}

          <FooterSection title="Contact Us">
            <div className="space-y-4">
              <ContactItem icon={MapPin} type="text">
                {contact.address}
              </ContactItem>
              <ContactItem icon={Phone} href={`tel:${contact.phone}`}>
                {contact.phone}
              </ContactItem>
              <ContactItem icon={Mail} href={`mailto:${contact.email}`}>
                {contact.email}
              </ContactItem>
            </div>
          </FooterSection>

          <FooterSection title="Quick Links">
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `block text-sm transition-all duration-200 hover:translate-x-1 hover:text-sky-400 ${
                        isActive ? "text-sky-400" : "text-gray-300"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </FooterSection>
        </div>
        <div
          className={`mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 sm:flex-row`}
        >
          <p className="flex items-center gap-1 text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {company.name}. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <NavLink
              to="/privacy"
              className="transition-colors hover:text-sky-400"
            >
              Privacy
            </NavLink>
            <span>•</span>
            <NavLink
              to="/terms"
              className="transition-colors hover:text-sky-400"
            >
              Terms
            </NavLink>
            <span>•</span>
            <NavLink
              to="/sitemap"
              className="transition-colors hover:text-sky-400"
            >
              Sitemap
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
