import React from "react";
import { User, Menu, LogOut, LogIn } from "lucide-react";
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
                        variant="header-auth-logout"
                        size="sm"
                        iconLeft={<LogOut size={16} strokeWidth={2} />}
                        className="transition-all duration-300 hover:shadow-lg"
                        onClick={logout}
                    >
                        <span className="font-medium">Logout</span>
                    </Button>
                ) : (
                    <Button
                        variant="header-auth-login"
                        size="sm"
                        iconLeft={<LogIn size={16} strokeWidth={2} />}
                        className="transition-all duration-300 hover:shadow-lg"
                        onClick={() => login()}
                    >
                        <span className="font-medium">Login</span>
                    </Button>
                )}
            </div>
            {!isMenuOpen && (
                <Button
                    variant="icon-dark"
                    onClick={onMenuToggle}
                    className="lg:hidden"
                    iconLeft={<Menu size={20} />}
                />
            )}
        </div>
    );
};

export default HeaderActions;
