import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Topbar from "./Topbar";
import Breaking from "./Breaking";
import Logo from "../Ui/Logo";
import Navigation from "./Navigation";
import HeaderActions from "./HeaderActions";
import MobileMenu from "./MobileMenu";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <div className="relative">
      <Topbar />

      <header className="sticky top-0 z-50 w-full bg-slate-900 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1">
            {/* Logo */}
            {!isMenuOpen && <Logo />}

            {/* Desktop Navigation */}
            <Navigation variant="desktop" />

            {/* Buttons */}
            <HeaderActions
              isMenuOpen={isMenuOpen}
              onMenuToggle={handleMenuToggle}
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMenuOpen} onClose={handleMenuClose} />
      </header>

      <Breaking />
    </div>
  );
}

export default Header;
