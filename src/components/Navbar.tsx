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

const navLinks = [
    { label: "Home", to: "/" },
    { label: "Dashboard", to: "/dashboard" },
    { label: "About Us", to: "/about" },
    { label: "Contact Us", to: "contact" }
];

const resourceLinks = [
    { label: "Countries", to: "/countries" },
    { label: "Indian Ports", to: "/indian-ports" },
    { label: "HS Codes", to: "#" },
    { label: "Converter", to: "#" }
];

const currencyData = [
    { img: "/usd.svg", label: "USD", value: "1" },
    { img: "/euro.png", label: "EUR", value: "0.87" }
];

const NavLink = ({ to, label }: { to: string; label: string }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Button
            variant="ghost"
            className={clsx(
                "hover:text-[#60A5FA] hover:bg-[#C7D2FE]/20 px-4 py-2 text-sm transition-colors duration-200",
                isActive ? "text-white font-medium" : "text-white"
            )}
            asChild
        >
            <Link to={to}>{label}</Link>
        </Button>
    );
};

const CurrencyBox = ({ img, label, value }: { img: string; label: string; value: string }) => (
    <div className="flex items-center border border-[#C7D2FE] rounded-md px-2 py-1 space-x-1.5 text-sm bg-[#EEF2FF]">
        <img src={img} alt={`${label} Flag`} width={20} height={14} className="rounded-sm" />
        <span className="text-[#1E293B]">{label}</span>
        <span className="text-[#1E293B] rounded-sm px-1 bg-[#C7D2FE] text-xs">{value}</span>
    </div>
);

const Navbar = () => {
    const [showResources, setShowResources] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

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
                                {resourceLinks.map(link => (
                                    <Link
                                        key={link.label}
                                        to={link.to}
                                        className="block px-3 py-1.5 text-xs text-[#1E293B] hover:text-[#1E3A8A] hover:bg-[#C7D2FE]/30 transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {navLinks.slice(2).map(link => (
                        <NavLink key={link.label} {...link} />
                    ))}
                </div>

                <div className="hidden xl:flex items-center space-x-4">
                    {currencyData.map(data => (
                        <CurrencyBox key={data.label} {...data} />
                    ))}

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
                                {navLinks.map((link) => (
                                    <Link key={link.label} to={link.to} className="text-[#1E293B] hover:text-[#1E3A8A] text-sm py-1 transition-colors duration-200">
                                        {link.label}
                                    </Link>
                                ))}

                                <Collapsible className="w-full">
                                    <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-1 text-[#1E293B] hover:text-[#1E3A8A] transition-colors duration-200">
                                        Resources <ChevronDown className="ml-auto h-3 w-3" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pt-2 pl-4">
                                        {resourceLinks.map((link) => (
                                            <Link key={link.label} to={link.to} className="block px-2 py-1 text-sm text-[#1E293B] hover:text-[#1E3A8A] transition-colors duration-200">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>

                                <div className="flex flex-col items-center space-y-3 w-full pt-3 border-t border-[#C7D2FE] mt-3">
                                    <div className="flex space-x-4">
                                        {currencyData.map((data) => (
                                            <CurrencyBox key={data.label} {...data} />
                                        ))}
                                    </div>
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
