import React from "react";
import { User, Menu } from "lucide-react";
import Button from "../Ui/Button";
import { useAuth0 } from "@auth0/auth0-react";

const HeaderActions = ({ isMenuOpen, onMenuToggle }) => {
    const {
        isAuthenticated,
        loginWithRedirect: login,
        logout: auth0Logout,
    } = useAuth0();

    const logout = () =>
        auth0Logout({ logoutParams: { returnTo: window.location.origin } });

    return (
        <div className="flex items-center gap-4">
            <div className="hidden lg:flex">
                {isAuthenticated ? (
                    <Button
                        variant="outline"
                        size="small"
                        iconLeft={
                            <User
                                size={16}
                                className="text-white"
                                strokeWidth={3}
                            />
                        }
                        className="border-slate-600 transition-colors duration-300 hover:border-sky-400"
                        onClick={logout}
                    >
                        <span className="text-sm">Logout</span>
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="small"
                        iconLeft={
                            <User
                                size={16}
                                className="text-white"
                                strokeWidth={3}
                            />
                        }
                        className="border-slate-600 transition-colors duration-300 hover:border-sky-400"
                        onClick={() => login()}
                    >
                        <span className="text-sm">Login</span>
                    </Button>
                )}
            </div>
            {!isMenuOpen && (
                <Button
                    className="p-2 transition-colors duration-200 hover:bg-slate-700 lg:hidden"
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
