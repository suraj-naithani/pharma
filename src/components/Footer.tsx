import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-[#14245C] text-white">
            <div className="container mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Company Info */}
                    <div className="flex flex-col items-start space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#60A5FA] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <h2 className="text-xl font-bold text-white">Chemys</h2>
                        </div>
                        <p className="text-[#C7D2FE] text-sm leading-relaxed max-w-xs">
                            Your trusted partner for comprehensive trade analytics and insights.
                            Empowering businesses with data-driven decisions.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-[#C7D2FE] hover:text-[#60A5FA] transition-colors duration-200">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-[#C7D2FE] hover:text-[#60A5FA] transition-colors duration-200">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-[#C7D2FE] hover:text-[#60A5FA] transition-colors duration-200">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-[#C7D2FE] hover:text-[#60A5FA] transition-colors duration-200">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-[#C7D2FE] hover:text-[#60A5FA] text-sm transition-colors duration-200">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-[#C7D2FE] hover:text-[#60A5FA] text-sm transition-colors duration-200">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-[#C7D2FE] hover:text-[#60A5FA] text-sm transition-colors duration-200">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-[#C7D2FE] hover:text-[#60A5FA] text-sm transition-colors duration-200">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/countries" className="text-[#C7D2FE] hover:text-[#60A5FA] text-sm transition-colors duration-200">
                                    Countries
                                </Link>
                            </li>
                            <li>
                                <Link to="/indian-ports" className="text-[#C7D2FE] hover:text-[#60A5FA] text-sm transition-colors duration-200">
                                    Indian Ports
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-[#C7D2FE] hover:text-[#60A5FA] text-sm transition-colors duration-200">
                                    HS Codes
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-[#C7D2FE] hover:text-[#60A5FA] text-sm transition-colors duration-200">
                                    Converter
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-white mb-6">Contact Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 text-[#60A5FA]" />
                                <span className="text-[#C7D2FE] text-sm">info@chemys.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 text-[#60A5FA]" />
                                <span className="text-[#C7D2FE] text-sm">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-4 w-4 text-[#60A5FA] mt-0.5" />
                                <span className="text-[#C7D2FE] text-sm">
                                    123 Business Street<br />
                                    Suite 100, City, State 12345
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#1E3A8A] mb-8"></div>

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-[#C7D2FE] text-sm">
                        <p>Copyright © {new Date().getFullYear()} Chemys. All rights reserved.</p>
                    </div>
                    <div className="flex space-x-6">
                        <Link to="#" className="text-[#C7D2FE] hover:text-[#60A5FA] text-sm transition-colors duration-200">
                            Privacy Policy
                        </Link>
                        <Link to="#" className="text-[#C7D2FE] hover:text-[#60A5FA] text-sm transition-colors duration-200">
                            Terms of Service
                        </Link>
                        <Link to="#" className="text-[#C7D2FE] hover:text-[#60A5FA] text-sm transition-colors duration-200">
                            Cookie Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
