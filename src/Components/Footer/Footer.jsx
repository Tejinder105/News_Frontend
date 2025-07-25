@@ .. @@
 import { Mail, MapPin, Phone, ArrowUp } from "lucide-react";
 import React, { useState, useEffect } from "react";
 import { NavLink } from "react-router-dom";
 import { footerData } from "../../Constants/FooterData";
 
 const FooterSection = ({ title, children, className = "" }) => (
   <div className={`space-y-4 ${className}`}>
-    <h4 className="inline-block border-b-2 border-sky-400 pb-2 text-lg font-semibold text-white">
+    <h4 className="relative inline-block pb-3 text-lg font-semibold text-white">
       {title}
+      <div className="absolute bottom-0 left-0 h-0.5 w-12 bg-gradient-to-r from-sky-400 to-blue-500"></div>
     </h4>
     {children}
   </div>
 );
 
 const ContactItem = ({ icon: Icon, children, href, type = "link" }) => (
   <div className="group flex items-start space-x-3">
     <Icon
       size={18}
-      className="mt-0.5 flex-shrink-0 text-sky-400 transition-transform group-hover:scale-110"
+      className="mt-0.5 flex-shrink-0 text-sky-400 transition-all duration-200 group-hover:scale-110 group-hover:text-sky-300"
     />
     {type === "link" ? (
       <a
         href={href}
-        className="flex-1 text-sm text-gray-300 transition-colors hover:text-sky-400"
+        className="flex-1 text-sm text-gray-300 transition-colors duration-200 hover:text-sky-400"
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
-    className={`group transition-all duration-200 hover:scale-110 ${social.color}`}
+    className="group relative overflow-hidden rounded-lg bg-slate-800 p-2 transition-all duration-300 hover:scale-110 hover:bg-slate-700"
     aria-label={social.name}
   >
     <img
       src={social.icon}
       alt={social.name}
-      className="h-6 w-6 transition-transform duration-200 group-hover:scale-110"
+      className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
     />
+    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-400/20 to-blue-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
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
-    <footer className="relative bg-slate-900 text-white">
+    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
+      {/* Decorative top border */}
+      <div className="h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400"></div>
+      
       {showScrollTop && (
         <button
           onClick={scrollToTop}
-          className="fixed right-6 bottom-6 z-50 rounded-full bg-sky-500 p-3 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-sky-600"
+          className="fixed right-6 bottom-6 z-50 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 p-3 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl"
           aria-label="Scroll to top"
         >
           <ArrowUp size={20} />
         </button>
       )}
+      
       <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
           {/* Company Info */}
-          <div className="space-y-4 lg:col-span-2">
+          <div className="space-y-6 lg:col-span-2">
             <NavLink to="/" className="group flex items-center space-x-2">
               <img
                 src={company.logo}
                 alt="Logo"
-                className="h-8 w-8 rounded-full object-cover shadow-lg transition-transform duration-300 group-hover:scale-110"
+                className="h-10 w-10 rounded-full object-cover shadow-lg transition-transform duration-300 group-hover:scale-110"
               />
-              <span className="text-2xl font-bold text-white transition-colors group-hover:text-sky-400 sm:block">
+              <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-2xl font-bold text-transparent transition-all duration-300 group-hover:from-sky-400 group-hover:to-blue-400">
                 {company.name}
               </span>
             </NavLink>
 
-            <p className="max-w-md text-sm leading-relaxed text-gray-300">
+            <p className="max-w-md text-sm leading-relaxed text-gray-300 lg:text-base">
               {company.description}
             </p>
 
             {/* Social Links */}
-            <div className="space-y-3">
-              <h5 className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
+            <div className="space-y-4">
+              <h5 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                 Follow Us
               </h5>
-              <div className="flex gap-4">
+              <div className="flex gap-3">
                 {socialMedia.map((social, index) => (
                   <SocialLink key={index} social={social} />
                 ))}
               </div>
             </div>
           </div>
+          
           {/* Contact Info */}
-
           <FooterSection title="Contact Us">
-            <div className="space-y-4">
+            <div className="space-y-5">
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
-            <ul className="space-y-3">
+            <ul className="space-y-4">
               {quickLinks.map((link, index) => (
                 <li key={index}>
                   <NavLink
                     to={link.path}
                     className={({ isActive }) =>
-                      `block text-sm transition-all duration-200 hover:translate-x-1 hover:text-sky-400 ${
+                      `group flex items-center text-sm transition-all duration-200 hover:translate-x-2 hover:text-sky-400 ${
                         isActive ? "text-sky-400" : "text-gray-300"
                       }`
                     }
                   >
+                    <span className="mr-2 h-1 w-1 rounded-full bg-current opacity-0 transition-opacity duration-200 group-hover:opacity-100"></span>
                     {link.name}
                   </NavLink>
                 </li>
               ))}
             </ul>
           </FooterSection>
         </div>
-        <div
-          className={`mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-700 pt-8 sm:flex-row`}
-        >
-          <p className="flex items-center gap-1 text-sm text-gray-400">
+        
+        {/* Bottom Section */}
+        <div className="mt-12 border-t border-gray-700 pt-8">
+          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
+            <p className="flex items-center gap-1 text-sm text-gray-400">
             &copy; {new Date().getFullYear()} {company.name}. All rights
             reserved.
-          </p>
+            </p>
 
-          <div className="flex items-center gap-4 text-xs text-gray-500">
-            <NavLink
-              to="/privacy"
-              className="transition-colors hover:text-sky-400"
-            >
-              Privacy
-            </NavLink>
-            <span>•</span>
-            <NavLink
-              to="/terms"
-              className="transition-colors hover:text-sky-400"
-            >
-              Terms
-            </NavLink>
-            <span>•</span>
-            <NavLink
-              to="/sitemap"
-              className="transition-colors hover:text-sky-400"
-            >
-              Sitemap
-            </NavLink>
+            <div className="flex items-center gap-4 text-xs text-gray-500">
+              <NavLink
+                to="/privacy"
+                className="transition-colors duration-200 hover:text-sky-400"
+              >
+                Privacy
+              </NavLink>
+              <span className="text-gray-600">•</span>
+              <NavLink
+                to="/terms"
+                className="transition-colors duration-200 hover:text-sky-400"
+              >
+                Terms
+              </NavLink>
+              <span className="text-gray-600">•</span>
+              <NavLink
+                to="/sitemap"
+                className="transition-colors duration-200 hover:text-sky-400"
+              >
+                Sitemap
+              </NavLink>
+            </div>
           </div>
         </div>
       </div>
     </footer>
   );
 }
 
 export default Footer;