import React, { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, children, className = "" }) => {
  const overlayRef = useRef(null);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Click outside to close
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Trap focus inside modal
  useEffect(() => {
    if (!isOpen) return;
    const focusable = overlayRef.current.querySelectorAll(
      "a, button, textarea, input, select, [tabindex]:not([tabindex='-1'])"
    );
    if (focusable.length) focusable[0].focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div
        className={`relative w-full max-w-md mx-auto rounded-2xl bg-white dark:bg-slate-800 shadow-2xl p-6 sm:p-8 transition-all scale-100 animate-fade-in ${className}`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-sky-400 focus:outline-none text-2xl"
          aria-label="Close modal"
        >
          &times;
        </button>
        {children}
      </div>
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.97);}
          100% { opacity: 1; transform: scale(1);}
        }
        .animate-fade-in {
          animation: fade-in 0.15s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </div>
  );
};

export default Modal;
