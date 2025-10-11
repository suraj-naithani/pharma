import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useFetchUserProfileQuery } from "@/redux/api/authApi";
import { userNotExist } from "@/redux/reducers/authReducer";
import type { RootState } from "@/redux/store";
import clsx from "clsx";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CurrencyConverter from "./CurrencyConverter";

const navLinks = [
    { label: "Home", to: "/" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "/contact" }
];

const resourceLinks = [
    { label: "Countries", to: "/countries" },
    { label: "Indian Ports", to: "/indian-ports" },
    { label: "HS Codes", to: "/hscode" },
    { label: "Converter", to: "/currency-converter" }
];


const NavLink = ({ to, label }: { to: string; label: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Button
            variant="ghost"
            className={clsx(
                "hover:text-[#60A5FA] hover:bg-[#C7D2FE]/20 px-4 py-2 text-sm transition-colors duration-200 relative",
                isActive
                    ? "text-white font-medium bg-[#1E3A8A]/40 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#60A5FA]"
                    : "text-white"
            )}
            asChild
        >
            <Link to={to}>{label}</Link>
        </Button>
    );
};


const Navbar = () => {
    const [showResources, setShowResources] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const location = useLocation();

    const navigate = useNavigate();
    const { refetch } = useFetchUserProfileQuery();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("sessionId");
        dispatch(userNotExist());
        refetch();
        navigate("/signin");
    };

    const handleMouseEnter = () => {
        if (timeoutId) clearTimeout(timeoutId);
        setShowResources(true);
    };

    const handleMouseLeave = () => {
        const id = setTimeout(() => setShowResources(false), 100);
        setTimeoutId(id);
    };

    return (
        <nav className="w-full">
            <div className="text-white flex items-center justify-between h-16 px-4 md:px-8 bg-[#14245C] border-b border-[#1E3A8A]">
                <div className="text-xl font-semibold text-white">Chemys</div>

                <div className="hidden xl:flex items-center space-x-3">
                    {navLinks.slice(0, 2).map(link => (
                        <NavLink key={link.label} {...link} />
                    ))}

                    <div
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="flex items-center text-white hover:text-[#60A5FA] focus:outline-none text-sm px-4 py-2 transition-colors duration-200">
                            Resources <ChevronDown className="ml-1 h-3 w-3" />
                        </button>
                        {showResources && (
                            <div
                                className="absolute z-50 top-full mt-1 min-w-[140px] bg-[#EEF2FF] text-[#1E293B] shadow-lg rounded-md border border-[#C7D2FE]"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {resourceLinks.map(link => {
                                    const isActive = location.pathname === link.to;
                                    return (
                                        <Link
                                            key={link.label}
                                            to={link.to}
                                            className={clsx(
                                                "block px-3 py-1.5 text-xs hover:text-[#1E3A8A] hover:bg-[#C7D2FE]/30 transition-colors duration-200",
                                                isActive
                                                    ? "text-[#1E3A8A] font-medium bg-[#C7D2FE]/50"
                                                    : "text-[#1E293B]"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {navLinks.slice(2).map(link => (
                        <NavLink key={link.label} {...link} />
                    ))}
                </div>

                <div className="hidden xl:flex items-center space-x-4">
                    <CurrencyConverter />

                    <Button className="bg-[#3B82F6] text-white hover:bg-[#60A5FA] text-sm px-3 py-1.5 transition-colors duration-200" asChild>
                        <Link to="/admin-dashboard">Admin</Link>
                    </Button>
                    {user ? (
                        <Button
                            className="bg-[#3B82F6] text-white hover:bg-[#60A5FA] text-sm px-3 py-1.5 transition-colors duration-200"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button className="bg-[#3B82F6] text-white hover:bg-[#60A5FA] text-sm px-3 py-1.5 transition-colors duration-200" asChild>
                            <Link to="/signin">Login</Link>
                        </Button>
                    )}
                </div>

                <div className="xl:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:text-[#60A5FA]">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle navigation</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-4 bg-[#EEF2FF] text-[#1E293B]">
                            <div className="flex flex-col items-start space-y-2 pt-6">
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.to;
                                    return (
                                        <Link
                                            key={link.label}
                                            to={link.to}
                                            className={clsx(
                                                "text-sm py-1 transition-colors duration-200 relative pl-3 border-l-2",
                                                isActive
                                                    ? "text-[#1E3A8A] font-medium border-[#60A5FA]"
                                                    : "text-[#1E293B] hover:text-[#1E3A8A] border-transparent"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}

                                <Collapsible className="w-full">
                                    <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-1 text-[#1E293B] hover:text-[#1E3A8A] transition-colors duration-200">
                                        Resources <ChevronDown className="ml-auto h-3 w-3" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pt-2 pl-4">
                                        {resourceLinks.map((link) => {
                                            const isActive = location.pathname === link.to;
                                            return (
                                                <Link
                                                    key={link.label}
                                                    to={link.to}
                                                    className={clsx(
                                                        "block px-2 py-1 text-sm hover:text-[#1E3A8A] transition-colors duration-200",
                                                        isActive
                                                            ? "text-[#1E3A8A] font-medium"
                                                            : "text-[#1E293B]"
                                                    )}
                                                >
                                                    {link.label}
                                                </Link>
                                            );
                                        })}
                                    </CollapsibleContent>
                                </Collapsible>

                                <div className="flex flex-col items-center space-y-3 w-full pt-3 border-t border-[#C7D2FE] mt-3">
                                    <CurrencyConverter />
                                    <div className="flex space-x-4 w-full justify-center">
                                        <Button className="bg-[#3B82F6] text-white hover:bg-[#60A5FA] text-sm px-3 py-1.5 transition-colors duration-200" asChild>
                                            <Link to="/admin-dashboard">Admin</Link>
                                        </Button>
                                        {user ? (
                                            <Button
                                                className="bg-[#3B82F6] text-white hover:bg-[#60A5FA] text-sm px-3 py-1.5 transition-colors duration-200"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </Button>
                                        ) : (
                                            <Button className="bg-[#3B82F6] text-white hover:bg-[#60A5FA] text-sm px-3 py-1.5 transition-colors duration-200" asChild>
                                                <Link to="/signin">Login</Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
