import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

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
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    const [amount, setAmount] = useState(1);
    const [convertedAmount, setConvertedAmount] = useState("0.87");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
    const [toDropdownOpen, setToDropdownOpen] = useState(false);
    const fromDropdownRef = useRef<HTMLDivElement>(null);
    const toDropdownRef = useRef<HTMLDivElement>(null);

    // Fetch exchange rate
    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const isToday = selectedDate === new Date().toISOString().split('T')[0];
                let apiUrl;

                if (isToday) {
                    // Use latest rates for today
                    apiUrl = `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_yjJUTCPZCMosYS61xxVAAscj99B2G1AHTgH6rPWv&base_currency=${fromCurrency}&currencies=${toCurrency}`;
                } else {
                    // Use historical rates for selected date
                    apiUrl = `https://api.freecurrencyapi.com/v1/historical?apikey=fca_live_yjJUTCPZCMosYS61xxVAAscj99B2G1AHTgH6rPWv&base_currency=${fromCurrency}&currencies=${toCurrency}&date=${selectedDate}`;
                }

                const response = await fetch(apiUrl);
                const data = await response.json();

                // Handle different response formats
                let rate;
                if (isToday) {
                    rate = data.data[toCurrency];
                } else {
                    // For historical data, the structure might be different
                    rate = data.data?.[selectedDate]?.[toCurrency] || data.data?.[toCurrency];
                }

                setConvertedAmount(rate ? (amount * rate).toFixed(2) : "0.00");
            } catch (error) {
                console.error("Error fetching exchange rate:", error);
                // Fallback to static rates for common currencies
                const fallbackRates: { [key: string]: { [key: string]: number } } = {
                    USD: { EUR: 0.87, GBP: 0.79, INR: 83.45, JPY: 149.50, AUD: 1.52, CAD: 1.36, CNY: 7.24, CHF: 0.88, RUB: 91.50, BRL: 4.95, ZAR: 18.75, MXN: 17.25, SGD: 1.35, AED: 3.67, KRW: 1315.00, NZD: 1.62, SAR: 3.75, TRY: 30.25, THB: 35.50 },
                    EUR: { USD: 1.15, GBP: 0.91, INR: 95.80, JPY: 171.80, AUD: 1.75, CAD: 1.56, CNY: 8.32, CHF: 1.01, RUB: 105.20, BRL: 5.69, ZAR: 21.55, MXN: 19.85, SGD: 1.55, AED: 4.22, KRW: 1512.00, NZD: 1.86, SAR: 4.31, TRY: 34.80, THB: 40.80 },
                    GBP: { USD: 1.27, EUR: 1.10, INR: 105.40, JPY: 189.00, AUD: 1.92, CAD: 1.72, CNY: 9.15, CHF: 1.11, RUB: 115.70, BRL: 6.26, ZAR: 23.70, MXN: 21.85, SGD: 1.71, AED: 4.65, KRW: 1664.00, NZD: 2.05, SAR: 4.75, TRY: 38.30, THB: 44.90 }
                };
                const rate = fallbackRates[fromCurrency]?.[toCurrency] || 1;
                setConvertedAmount((amount * rate).toFixed(2));
            }
        };

        fetchExchangeRate();
    }, [fromCurrency, toCurrency, amount, selectedDate]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target as Node)) {
                setFromDropdownOpen(false);
            }
            if (toDropdownRef.current && !toDropdownRef.current.contains(event.target as Node)) {
                setToDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedFromCurrency = countryCurrencies.find(curr => curr.code === fromCurrency) || countryCurrencies[0];
    const selectedToCurrency = countryCurrencies.find(curr => curr.code === toCurrency) || countryCurrencies[2];

    const swapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] to-[#C7D2FE] py-8">
            <div className="mx-auto max-w-2xl px-4">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] mb-2">
                        Currency Converter
                    </h1>
                    <p className="text-sm text-[#1E293B] max-w-lg mx-auto">
                        Convert currencies with real-time exchange rates.
                    </p>
                </div>

                {/* Popular Conversions */}
                <div className="mb-6">
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {[
                            { from: "USD", to: "EUR", label: "USD to EUR" },
                            { from: "USD", to: "GBP", label: "USD to GBP" },
                            { from: "USD", to: "INR", label: "USD to INR" },
                            { from: "EUR", to: "GBP", label: "EUR to GBP" },
                            { from: "USD", to: "JPY", label: "USD to JPY" },
                            { from: "USD", to: "CAD", label: "USD to CAD" }
                        ].map((conversion) => (
                            <button
                                key={conversion.label}
                                onClick={() => {
                                    setFromCurrency(conversion.from);
                                    setToCurrency(conversion.to);
                                }}
                                className="bg-white rounded-lg border border-[#C7D2FE] p-3 hover:bg-[#F8FAFC] transition-colors text-left"
                            >
                                <div className="font-medium text-[#1E293B] text-sm">{conversion.label}</div>
                                <div className="text-xs text-[#64748B] mt-1">Quick conversion</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Converter Card */}
                <div className="bg-white rounded-xl shadow-lg border border-[#C7D2FE] p-6">
                    <div className="space-y-4">
                        {/* Amount and Date Input */}
                        <div className="grid gap-2 md:grid-cols-2">
                            <div>
                                <label className="block text-xs font-medium text-[#1E293B] mb-1">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    placeholder="Enter amount"
                                    className="w-full px-2 py-1.5 text-sm rounded-md border border-[#C7D2FE] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-[#1E293B] mb-1">
                                    Date
                                </label>
                                <div className="flex gap-1.5">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="flex-1 px-2 py-1.5 text-sm rounded-md border border-[#C7D2FE] focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] outline-none transition-colors"
                                    />
                                    <button
                                        onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                                        className="px-2 py-1.5 bg-[#3B82F6] text-white rounded-md hover:bg-[#60A5FA] transition-colors text-xs font-medium whitespace-nowrap"
                                    >
                                        Today
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Currency Selection */}
                        <div className="flex items-end gap-2">
                            {/* From Currency */}
                            <div className="relative flex-1" ref={fromDropdownRef}>
                                <label className="block text-xs font-medium text-[#1E293B] mb-1">
                                    From
                                </label>
                                <div
                                    className="flex items-center border border-[#C7D2FE] rounded-md px-2 py-1.5 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                                    onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
                                >
                                    <img src={selectedFromCurrency.img} alt={`${selectedFromCurrency.code} Flag`} width={16} height={12} className="rounded-sm mr-1.5" />
                                    <span className="text-[#1E293B] font-medium text-sm">{selectedFromCurrency.code}</span>
                                    <span className="text-[#64748B] text-xs ml-1">{selectedFromCurrency.currency}</span>
                                    <ChevronDown className="h-3 w-3 text-[#64748B] ml-auto" />
                                </div>

                                {fromDropdownOpen && (
                                    <div className="absolute z-50 top-full mt-1 left-0 right-0 max-h-48 overflow-y-auto bg-white border border-[#C7D2FE] rounded-lg shadow-lg">
                                        {countryCurrencies.map((currency) => (
                                            <div
                                                key={currency.code}
                                                className="flex items-center space-x-2 px-3 py-2 hover:bg-[#F1F5F9] cursor-pointer transition-colors"
                                                onClick={() => {
                                                    setFromCurrency(currency.code);
                                                    setFromDropdownOpen(false);
                                                }}
                                            >
                                                <img src={currency.img} alt={`${currency.code} Flag`} width={20} height={15} className="rounded-sm" />
                                                <span className="text-[#1E293B] font-medium text-sm">{currency.code}</span>
                                                <span className="text-[#64748B] text-xs">{currency.country}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Swap Button */}
                            <div className="flex items-end">
                                <button
                                    onClick={swapCurrencies}
                                    className="bg-[#3B82F6] text-white p-2 rounded-lg hover:bg-[#60A5FA] transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </button>
                            </div>

                            {/* To Currency */}
                            <div className="relative flex-1" ref={toDropdownRef}>
                                <label className="block text-xs font-medium text-[#1E293B] mb-1">
                                    To
                                </label>
                                <div
                                    className="flex items-center border border-[#C7D2FE] rounded-md px-2 py-1.5 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
                                    onClick={() => setToDropdownOpen(!toDropdownOpen)}
                                >
                                    <img src={selectedToCurrency.img} alt={`${selectedToCurrency.code} Flag`} width={16} height={12} className="rounded-sm mr-1.5" />
                                    <span className="text-[#1E293B] font-medium text-sm">{selectedToCurrency.code}</span>
                                    <span className="text-[#64748B] text-xs ml-1">{selectedToCurrency.currency}</span>
                                    <ChevronDown className="h-3 w-3 text-[#64748B] ml-auto" />
                                </div>

                                {toDropdownOpen && (
                                    <div className="absolute z-50 top-full mt-1 left-0 right-0 max-h-48 overflow-y-auto bg-white border border-[#C7D2FE] rounded-lg shadow-lg">
                                        {countryCurrencies.map((currency) => (
                                            <div
                                                key={currency.code}
                                                className="flex items-center space-x-2 px-3 py-2 hover:bg-[#F1F5F9] cursor-pointer transition-colors"
                                                onClick={() => {
                                                    setToCurrency(currency.code);
                                                    setToDropdownOpen(false);
                                                }}
                                            >
                                                <img src={currency.img} alt={`${currency.code} Flag`} width={20} height={15} className="rounded-sm" />
                                                <span className="text-[#1E293B] font-medium text-sm">{currency.code}</span>
                                                <span className="text-[#64748B] text-xs">{currency.country}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Result */}
                        <div className="bg-gradient-to-r from-[#EEF2FF] to-[#C7D2FE] rounded-lg p-4 border border-[#C7D2FE]">
                            <div className="text-center">
                                <div className="text-xs text-[#64748B] mb-1">Converted Amount</div>
                                <div className="text-2xl font-bold text-[#1E293B]">
                                    {convertedAmount} {selectedToCurrency.code}
                                </div>
                                <div className="text-xs text-[#64748B] mt-1">
                                    {amount} {selectedFromCurrency.code} = {convertedAmount} {selectedToCurrency.code}
                                </div>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="text-center text-xs text-[#64748B]">
                            <p>Exchange rates for {selectedDate === new Date().toISOString().split('T')[0] ? 'today' : selectedDate}</p>
                            <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyConverter;
