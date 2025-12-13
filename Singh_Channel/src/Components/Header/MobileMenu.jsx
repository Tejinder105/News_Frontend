import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { X, LogIn, UserPlus, ChevronDown, ChevronRight, Home, Info, Phone, Shield } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../Ui/Logo";
import { navItems } from "../../Constants/Navigation";
import { NavLink, useLocation } from "react-router-dom";
import Button from "../Ui/Button";
import { useAdminCheck } from "../../hooks/useAdminCheck";

// Animation Variants
const menuVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 30, staggerChildren: 0.05, delayChildren: 0.1 }
  },
  exit: { opacity: 0, x: "100%", transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [expandedItems, setExpandedItems] = useState({});
  const { isAdmin } = useAdminCheck();

  const toggleExpand = (name) => {
    setExpandedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    const isExpanded = expandedItems[item.name];
    const hasChildren = item.children && item.children.length > 0;

    return (
      <motion.div variants={itemVariants} className="w-full">
        {hasChildren ? (
          <div className="flex flex-col">
            <button
              onClick={() => toggleExpand(item.name)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-4 text-left transition-all ${isExpanded || isActive ? 'bg-white/5 text-blue-400' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}
            >
              <div className="flex items-center gap-4">
                {/* Icon Placeholder or specific icon mapping could go here */}
                <span className="text-lg font-medium tracking-wide">{item.name}</span>
              </div>
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {/* Dropdown Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-black/20"
                >
                  <div className="flex flex-col py-2 pl-4">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.path}
                        onClick={onClose}
                        className={({ isActive: isChildActive }) =>
                          `block border-l-2 py-3 pl-6 text-base font-medium transition-colors ${isChildActive ? 'border-blue-500 text-blue-400' : 'border-white/10 text-gray-400 hover:text-white'}`
                        }
                      >
                        {child.name}
                      </NavLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <NavLink
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              `flex w-full items-center gap-4 rounded-xl px-4 py-4 transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`
            }
          >
            <span className="text-lg font-medium tracking-wide">{item.name}</span>
          </NavLink>
        )}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            key="mobile-drawer"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col bg-[#0A0F1F]/95 backdrop-blur-2xl shadow-2xl lg:hidden border-l border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <Logo size="normal" showText={true} className="scale-110 origin-left" />
              <button
                onClick={onClose}
                className="rounded-full bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Nav Items */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-white/10">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
                
                {/* Admin Link */}
                {isAdmin && (
                  <motion.div variants={itemVariants} className="w-full">
                    <NavLink
                      to="/admin"
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex w-full items-center gap-4 rounded-xl px-4 py-4 transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`
                      }
                    >
                      <Shield size={20} />
                      <span className="text-lg font-medium tracking-wide">Admin</span>
                    </NavLink>
                  </motion.div>
                )}
              </nav>
            </div>

            {/* Footer Auth Section */}
            <div className="border-t border-white/10 bg-black/20 p-6">
              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-2">
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full border border-white/20" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {user?.name?.[0] || "U"}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user?.name}</span>
                      <span className="text-xs text-gray-400">{user?.email}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500"
                    onClick={() => {
                      logout({ logoutParams: { returnTo: window.location.origin } });
                      onClose();
                    }}
                  >
                    Log Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full justify-center shadow-lg shadow-blue-900/20"
                    iconLeft={<LogIn size={18} />}
                    onClick={() => { loginWithRedirect(); onClose(); }}
                  >
                    Log In
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full justify-center border-white/20 text-gray-300 hover:bg-white/5 hover:text-white hover:border-white/50"
                    iconLeft={<UserPlus size={18} />}
                    onClick={() => { loginWithRedirect({ authorizationParams: { screen_hint: "signup" } }); onClose(); }}
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              <p className="mt-6 text-center text-xs text-gray-600">
                &copy; 2025 Singh Channel
              </p>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
