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
                "hover:text-black px-4 py-2 text-sm",
                isActive ? "text-black" : "text-[#9e9e9e]"
            )}
            asChild
        >
            <Link to={to}>{label}</Link>
        </Button>
    );
};

const CurrencyBox = ({ img, label, value }: { img: string; label: string; value: string }) => (
    <div className="flex items-center border border-gray-400 rounded-md px-2 py-1 space-x-1.5 text-sm">
        <img src={img} alt={`${label} Flag`} width={20} height={14} className="rounded-sm" />
        <span className="text-[#7e7c7b]">{label}</span>
        <span className="text-[#7e7c7b] rounded-sm px-1 bg-[#F0F0F0] text-xs">{value}</span>
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
            <div className="text-black flex items-center justify-between h-16 px-4 md:px-8 bg-white border-b border-gray-200">
                <div className="text-xl font-semibold">Chemys</div>

                <div className="hidden xl:flex items-center space-x-3">
                    {navLinks.slice(0, 2).map(link => (
                        <NavLink key={link.label} {...link} />
                    ))}

                    <div
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="flex items-center text-[#9e9e9e] hover:text-black focus:outline-none text-sm px-4 py-2">
                            Resources <ChevronDown className="ml-1 h-3 w-3" />
                        </button>
                        {showResources && (
                            <div
                                className="absolute z-50 top-full mt-1 min-w-[140px] bg-white text-black shadow-md rounded-md border border-gray-200"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {resourceLinks.map(link => (
                                    <Link
                                        key={link.label}
                                        to={link.to}
                                        className="block px-3 py-1.5 text-xs text-[#9e9e9e] hover:text-black"
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

                    <Button className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-1.5" asChild>
                        <Link to="/admin-dashboard">Admin</Link>
                    </Button>
                    {user ? (
                        <Button
                            className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-1.5"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-1.5" asChild>
                            <Link to="/signin">Login</Link>
                        </Button>
                    )}
                </div>

                <div className="xl:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-black">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle navigation</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-4 bg-white text-black">
                            <div className="flex flex-col items-start space-y-2 pt-6">
                                {navLinks.map((link) => (
                                    <Link key={link.label} to={link.to} className="text-[#9e9e9e] hover:text-black text-sm py-1">
                                        {link.label}
                                    </Link>
                                ))}

                                <Collapsible className="w-full">
                                    <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium py-1">
                                        Resources <ChevronDown className="ml-auto h-3 w-3" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pt-2 pl-4">
                                        {resourceLinks.map((link) => (
                                            <Link key={link.label} to={link.to} className="block px-2 py-1 text-sm text-[#9e9e9e] hover:text-black">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>

                                <div className="flex flex-col items-center space-y-3 w-full pt-3 border-t border-gray-300 mt-3">
                                    <div className="flex space-x-4">
                                        {currencyData.map((data) => (
                                            <CurrencyBox key={data.label} {...data} />
                                        ))}
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <Button className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-1.5" asChild>
                                            <Link to="#">Admin</Link>
                                        </Button>
                                        {user ? (
                                            <Button
                                                className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-1.5"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </Button>
                                        ) : (
                                            <Button className="bg-black text-white hover:bg-gray-800 text-sm px-3 py-1.5" asChild>
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
