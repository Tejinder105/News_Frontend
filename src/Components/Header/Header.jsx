@@ .. @@
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
+  const [isScrolled, setIsScrolled] = useState(false);
   const location = useLocation();
 
   useEffect(() => {
     setIsMenuOpen(false);
   }, [location]);
 
+  useEffect(() => {
+    const handleScroll = () => {
+      setIsScrolled(window.scrollY > 10);
+    };
+    window.addEventListener("scroll", handleScroll);
+    return () => window.removeEventListener("scroll", handleScroll);
+  }, []);
+
   const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
   const handleMenuClose = () => setIsMenuOpen(false);
 
   return (
     <div className="relative">
       <Topbar />
 
-      <header className="sticky top-0 z-50 w-full bg-slate-900 shadow-lg">
-        <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
-          <div className="flex items-center justify-between py-1">
+      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
+        isScrolled 
+          ? "bg-slate-900/95 backdrop-blur-md shadow-xl" 
+          : "bg-slate-900 shadow-lg"
+      }`}>
+        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
+          <div className="flex items-center justify-between">
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