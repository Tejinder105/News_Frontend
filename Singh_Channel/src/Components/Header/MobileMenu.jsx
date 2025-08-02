import React from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../Ui/Logo";
import { navItems } from "../../Constants/Navigation";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";

const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 300 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 300 / 1000 }}
            className="fixed inset-0 z-50 max-h-[90vh] w-full overflow-y-auto bg-slate-900 px-6 pt-4 pb-6 shadow-xl lg:hidden"
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-700 pb-3">
              <Logo size="small" />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="text-white"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              <button
                className="w-full text-left text-slate-800 dark:text-white font-semibold py-2 px-2 rounded hover:bg-sky-50 dark:hover:bg-slate-800"
                onClick={() => { navigate("/login"); onClose(); }}
              >
                Login
              </button>
              <button
                className="w-full text-left text-slate-800 dark:text-white font-semibold py-2 px-2 rounded hover:bg-sky-50 dark:hover:bg-slate-800"
                onClick={() => { navigate("/signup"); onClose(); }}
              >
                Sign Up
              </button>
              <Navigation variant="mobile" />
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
