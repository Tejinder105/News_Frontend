import React from "react";
import { X, LogIn, UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../Ui/Logo";
import { navItems } from "../../Constants/Navigation";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";
import Button from "../Ui/Button";

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
              <Button
                variant="icon-dark"
                onClick={onClose}
                iconLeft={<X size={20} />}
              />
            </div>
            <nav className="flex flex-col gap-4">
              <Button
                variant="auth-login"
                size="md"
                className="w-full justify-center"
                iconLeft={<LogIn size={18} />}
                onClick={() => { navigate("/login"); onClose(); }}
              >
                Login
              </Button>
              <Button
                variant="auth-outline-login"
                size="md"
                className="w-full justify-center"
                iconLeft={<UserPlus size={18} />}
                onClick={() => { navigate("/signup"); onClose(); }}
              >
                Sign Up
              </Button>
              <div className="border-t border-slate-700 pt-4 mt-4">
                <Navigation variant="mobile" />
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
