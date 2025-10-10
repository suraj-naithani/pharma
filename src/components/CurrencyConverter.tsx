import { useState, useEffect, useRef } from "react";
// Currency data with country flags
const countryCurrencies = [
    { country: "United States", currency: "US Dollar", code: "USD", img: "https://flagcdn.com/w40/us.png" },
    { country: "United Kingdom", currency: "Pound Sterling", code: "GBP", img: "https://flagcdn.com/w40/gb.png" },
    { country: "European Union", currency: "Euro", code: "EUR", img: "https://flagcdn.com/w40/eu.png" },
    { country: "India", currency: "Indian Rupee", code: "INR", img: "https://flagcdn.com/w40/in.png" },
    { country: "Japan", currency: "Japanese Yen", code: "JPY", img: "https://flagcdn.com/w40/jp.png" },
    { country: "Australia", currency: "Australian Dollar", code: "AUD", img: "https://flagcdn.com/w40/au.png" },
    { country: "Canada", currency: "Canadian Dollar", code: "CAD", img: "https://flagcdn.com/w40/ca.png" },
    { country: "China", currency: "Chinese Yuan", code: "CNY", img: "https://flagcdn.com/w40/cn.png" },
    { country: "Switzerland", currency: "Swiss Franc", code: "CHF", img: "https://flagcdn.com/w40/ch.png" },
    { country: "Russia", currency: "Russian Ruble", code: "RUB", img: "https://flagcdn.com/w40/ru.png" },
    { country: "Brazil", currency: "Brazilian Real", code: "BRL", img: "https://flagcdn.com/w40/br.png" },
    { country: "South Africa", currency: "South African Rand", code: "ZAR", img: "https://flagcdn.com/w40/za.png" },
    { country: "Mexico", currency: "Mexican Peso", code: "MXN", img: "https://flagcdn.com/w40/mx.png" },
    { country: "Singapore", currency: "Singapore Dollar", code: "SGD", img: "https://flagcdn.com/w40/sg.png" },
    { country: "United Arab Emirates", currency: "UAE Dirham", code: "AED", img: "https://flagcdn.com/w40/ae.png" },
    { country: "South Korea", currency: "South Korean Won", code: "KRW", img: "https://flagcdn.com/w40/kr.png" },
    { country: "New Zealand", currency: "New Zealand Dollar", code: "NZD", img: "https://flagcdn.com/w40/nz.png" },
    { country: "Saudi Arabia", currency: "Saudi Riyal", code: "SAR", img: "https://flagcdn.com/w40/sa.png" },
    { country: "Turkey", currency: "Turkish Lira", code: "TRY", img: "https://flagcdn.com/w40/tr.png" },
    { country: "Thailand", currency: "Thai Baht", code: "THB", img: "https://flagcdn.com/w40/th.png" }
];

const CurrencyConverter = () => {
    const [toCurrency, setToCurrency] = useState("EUR");
    const [convertedAmount, setConvertedAmount] = useState("0.87");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch exchange rate
    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await fetch(
                    `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_yjJUTCPZCMosYS61xxVAAscj99B2G1AHTgH6rPWv&base_currency=USD&currencies=${toCurrency}`
                );
                const data = await response.json();
                const rate = data.data[toCurrency];
                setConvertedAmount(rate ? rate.toFixed(2) : "0.00");
            } catch (error) {
                console.error("Error fetching exchange rate:", error);
                // Fallback to static rates for common currencies
                const fallbackRates: { [key: string]: string } = {
                    EUR: "0.87", GBP: "0.79", INR: "83.45", JPY: "149.50",
                    AUD: "1.52", CAD: "1.36", CNY: "7.24", CHF: "0.88",
                    RUB: "91.50", BRL: "4.95", ZAR: "18.75", MXN: "17.25",
                    SGD: "1.35", AED: "3.67", KRW: "1315.00", NZD: "1.62",
                    SAR: "3.75", TRY: "30.25", THB: "35.50"
                };
                setConvertedAmount(fallbackRates[toCurrency] || "1.00");
            }
        };

        fetchExchangeRate();
    }, [toCurrency]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedCurrency = countryCurrencies.find(curr => curr.code === toCurrency) || countryCurrencies[2]; // Default to EUR

    return (
        <div className="flex items-center space-x-2">
            {/* Fixed USD */}
            <div className="flex items-center border border-[#C7D2FE] rounded-md px-2 py-1 space-x-1.5 text-sm bg-[#EEF2FF]">
                <img src="https://flagcdn.com/w40/us.png" alt="USD Flag" width={20} height={14} className="rounded-sm" />
                <span className="text-[#1E293B]">USD</span>
                <span className="text-[#1E293B] rounded-sm px-1 bg-[#C7D2FE] text-xs">1</span>
            </div>

            {/* Selectable Currency */}
            <div className="relative" ref={dropdownRef}>
                <div
                    className="flex items-center border border-[#C7D2FE] rounded-md px-2 py-1 space-x-1.5 text-sm bg-[#EEF2FF] cursor-pointer hover:bg-[#E0E7FF] transition-colors"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    <img src={selectedCurrency.img} alt={`${selectedCurrency.code} Flag`} width={20} height={14} className="rounded-sm" />
                    <span className="text-[#1E293B]">{selectedCurrency.code}</span>
                    <span className="text-[#1E293B] rounded-sm px-1 bg-[#C7D2FE] text-xs">{convertedAmount}</span>
                </div>

                {dropdownOpen && (
                    <div className="absolute z-50 top-full mt-1 right-0 w-48 max-h-60 overflow-y-auto bg-white border border-[#C7D2FE] rounded-md shadow-lg">
                        {countryCurrencies.map((currency) => (
                            <div
                                key={currency.code}
                                className="flex items-center space-x-2 px-3 py-2 hover:bg-[#F1F5F9] cursor-pointer transition-colors"
                                onClick={() => {
                                    setToCurrency(currency.code);
                                    setDropdownOpen(false);
                                }}
                            >
                                <img src={currency.img} alt={`${currency.code} Flag`} width={20} height={14} className="rounded-sm" />
                                <span className="text-[#1E293B] text-sm">{currency.code}</span>
                                <span className="text-[#64748B] text-xs">{currency.country}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CurrencyConverter;
