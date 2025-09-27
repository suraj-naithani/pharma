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
                "hover:bg-[#F0F0F0] hover:text-black hover:rounded-full px-4 py-2",
                isActive ? "bg-[#F0F0F0] text-black rounded-full" : "text-white"
            )}
            asChild
        >
            <Link to={to}>{label}</Link>
        </Button>
    );
};

const CurrencyBox = ({ img, label, value }: { img: string; label: string; value: string }) => (
    <div className="flex items-center border border-gray-400 rounded-md px-2 py-1 space-x-2">
        <img src={img} alt={`${label} Flag`} width={24} height={16} className="rounded-sm" />
        <span>{label}</span>
        <span className="text-black rounded-sm px-1 bg-[#F0F0F0]">{value}</span>
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
            <div className="text-white flex items-center justify-between h-16 px-4 md:px-8 bg-[#2A408C]">
                <div className="text-xl font-bold">Chemys</div>

                <div className="hidden xl:flex items-center space-x-6">
                    {navLinks.slice(0, 2).map(link => (
                        <NavLink key={link.label} {...link} />
                    ))}

                    <div
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="flex items-center hover:text-gray-300 focus:outline-none">
                            Resources <ChevronDown className="ml-1 h-4 w-4" />
                        </button>
                        {showResources && (
                            <div
                                className="absolute z-50 top-full mt-1 min-w-[160px] bg-[#2A408C] text-white shadow-md rounded-md"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                {resourceLinks.map(link => (
                                    <Link
                                        key={link.label}
                                        to={link.to}
                                        className="block px-4 py-2 hover:bg-blue-700"
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

                    <Button className="bg-[#F0F0F0] text-black hover:bg-[#e0e0e0]" asChild>
                        <Link to="/admin-dashboard">Admin</Link>
                    </Button>
                    {user ? (
                        <Button
                            className="bg-[#F0F0F0] text-black hover:bg-[#e0e0e0]"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Button className="bg-[#F0F0F0] text-black hover:bg-[#e0e0e0]" asChild>
                            <Link to="/signin">Login</Link>
                        </Button>
                    )}
                </div>

                <div className="xl:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle navigation</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-4 bg-[#2A408C] text-white">
                            <div className="flex flex-col items-start space-y-4 pt-8">
                                {navLinks.map((link) => (
                                    <Link key={link.label} to={link.to} className="hover:text-gray-300 text-lg">
                                        {link.label}
                                    </Link>
                                ))}

                                <Collapsible className="w-full">
                                    <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-semibold py-2">
                                        Resources <ChevronDown className="ml-auto h-4 w-4" />
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="pt-2 pl-4">
                                        {resourceLinks.map((link) => (
                                            <Link key={link.label} to={link.to} className="block px-2 py-1 hover:text-gray-300">
                                                {link.label}
                                            </Link>
                                        ))}
                                    </CollapsibleContent>
                                </Collapsible>

                                <div className="flex flex-col items-center space-y-4 w-full pt-4 border-t border-gray-600 mt-4">
                                    <div className="flex space-x-4">
                                        {currencyData.map((data) => (
                                            <CurrencyBox key={data.label} {...data} />
                                        ))}
                                    </div>
                                    <div className="flex space-x-4 w-full justify-center">
                                        <Button className="bg-[#F0F0F0] text-black hover:bg-[#e0e0e0]" asChild>
                                            <Link to="#">Admin</Link>
                                        </Button>
                                        {user ? (
                                            <Button
                                                className="bg-[#F0F0F0] text-black hover:bg-[#e0e0e0]"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </Button>
                                        ) : (
                                            <Button className="bg-[#F0F0F0] text-black hover:bg-[#e0e0e0]" asChild>
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
