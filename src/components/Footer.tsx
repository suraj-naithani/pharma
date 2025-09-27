import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-gray-100 text-gray-700">
            <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-start">
                    <img src="/average.png" alt="Company Logo" className="mb-2" width={40} height={40} />
                    <p className="text-sm text-gray-800">XYZ Private Ltd.</p>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-sm font-semibold uppercase text-gray-600 mb-4">SERVICES</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-gray-900 text-sm">
                                Branding
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-gray-900 text-sm">
                                Design
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-gray-900 text-sm">
                                Marketing
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-gray-900 text-sm">
                                Advertisement
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-sm font-semibold uppercase text-gray-600 mb-4">COMPANY</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-gray-900 text-sm">
                                About us
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-gray-900 text-sm">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-gray-900 text-sm">
                                Jobs
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-gray-900 text-sm">
                                Press kit
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-sm font-semibold uppercase text-gray-600 mb-4">LEGAL</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-gray-900 text-sm">
                                Terms of use
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-gray-900 text-sm">
                                Privacy policy
                            </Link>
                        </li>
                        <li>
                            <Link to="#" className="text-gray-700 hover:text-gray-900 text-sm">
                                Cookie policy
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="w-full bg-gray-200 py-4 text-center text-sm text-gray-600">
                <p>Copyright © {new Date().getFullYear()} - All right reserved by XYZ Private Ltd</p>
            </div>
        </footer>
    )
}
