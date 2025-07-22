import React from "react";
import { User, Menu } from "lucide-react";
import Button from "../Ui/Button";

const HeaderActions = ({ isMenuOpen, onMenuToggle }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="hidden lg:flex">
        <Button
          variant="outline"
          size="small"
          iconLeft={<User size={16} className="text-sky-400" strokeWidth={3} />}
          className="border-slate-600 transition-colors duration-300 hover:border-sky-400"
        >
          <span className="text-sm">Login</span>
        </Button>
      </div>
      {!isMenuOpen && (
        <Button
          className="lg:hidden p-2 hover:bg-slate-700 transition-colors duration-200"
          onClick={onMenuToggle}
          aria-label="Open Menu"
          variant="ghost"
        >
          <Menu className="text-white" size={20} />
        </Button>
      )}
    </div>
  );
};

export default HeaderActions;
