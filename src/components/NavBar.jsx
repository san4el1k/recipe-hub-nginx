import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Context } from "../main.jsx";

import logo from "../assets/logo.svg";
import recipes from "../assets/recipes.svg";
import recipesB from "../assets/recipesB.svg";
import plus from "../assets/plus.svg";
import plusW from "../assets/plusW.svg";

import { Menu, X } from "lucide-react";

const NavBar = () => {
    const { isAuth, logout, user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { path: "/", label: "Recipes", icon: recipesB, activeIcon: recipes, authRequired: false },
        { path: "/dashboard", label: "Dashboard", authRequired: true },
        { path: "/create", label: "Add Recipe", icon: plus, activeIcon: plusW, authRequired: true },
    ];

    const cn = (...classes) => classes.filter(Boolean).join(" ");

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
    };

    const renderButton = ({ path, label, icon, activeIcon, authRequired }) => {
        if (authRequired && !isAuth) return null;
        const isActive = location.pathname === path;

        return (
            <button
                key={path}
                className={cn(
                    "flex items-center gap-2 justify-center rounded-md text-sm font-medium transition-all h-9 px-4 py-2",
                    isActive
                        ? "bg-gray-900 text-white hover:bg-gray-700 cursor-default"
                        : "border border-gray-300 bg-gray-100 hover:bg-gray-300 cursor-pointer"
                )}
                onClick={() => {
                    setMenuOpen(false);
                    if (!isActive) navigate(path);
                }}
            >
                {icon && <img src={isActive && activeIcon ? activeIcon : icon} alt="" className="w-4 h-4" />}
                <span>{label}</span>
            </button>
        );
    };

    const AuthButtons = ({ mobile = false }) => {
        return isAuth ? (
            <>
                <p className={cn("text-sm font-medium bg-gray-50 rounded-md px-2", mobile && "py-1")}>
                    {user.name}
                </p>
                <button
                    className={cn(
                        "rounded-md bg-gray-900 text-white font-medium text-sm hover:bg-gray-700",
                        mobile ? "py-2" : "px-4 py-2"
                    )}
                    onClick={handleLogout}
                >
                    Sign Out
                </button>
            </>
        ) : (
            <>
                <button
                    className={cn("rounded-md bg-gray-100 font-medium text-sm hover:bg-gray-300", mobile ? "py-2" : "px-4 py-2")}
                    onClick={() => { navigate("/login"); setMenuOpen(false); }}
                >
                    Sign in
                </button>
                <button
                    className={cn("rounded-md bg-gray-900 text-white font-medium text-sm hover:bg-gray-700", mobile ? "py-2" : "px-4 py-2")}
                    onClick={() => { navigate("/registration"); setMenuOpen(false); }}
                >
                    Sign up
                </button>
            </>
        );
    };

    return (
        <nav className="bg-white/85 border-b border-gray-200 px-4 py-3 fixed top-0 left-0 right-0 z-50 shadow-sm transition-all duration-300 ease-in-out backdrop-blur-xs">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={() => navigate("/")} className="flex items-center h-9">
                        <img src={logo} alt="logo" width="32px" />
                        <span className="text-xl font-bold ml-3">Recipe Hub</span>
                    </button>

                    <div className="hidden md:flex items-center space-x-2 ml-6">
                        {navLinks.map(renderButton)}
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-2">
                    <AuthButtons />
                </div>

                <div className="md:hidden">
                    <button
                        className="p-2 rounded-md hover:bg-gray-100"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <div
                className={cn(
                    "md:hidden absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col p-3 space-y-2 transform transition-all duration-500 ease-out",
                    menuOpen
                        ? "opacity-100 max-h-96 translate-y-0"
                        : "opacity-0 max-h-0 -translate-y-3 overflow-hidden pointer-events-none"
                )}
            >
                {navLinks.map(renderButton)}
                <div className="border-t border-gray-300 my-2"></div>
                <AuthButtons mobile />
            </div>
        </nav>
    );
};

export default NavBar;
