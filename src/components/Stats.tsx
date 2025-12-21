import { Card, CardContent } from "@/components/ui/card";
import type { RootState } from "@/redux/store";
import { formatNumber } from "@/utils/helper";
import { BarChart3, Building, Building2, DollarSign, Package, TrendingUp, Globe2 } from "lucide-react";
import { useSelector } from "react-redux";

const Stats = () => {
    const summaryStats = useSelector((state: RootState) => state.dashboard.summary);
    const selectedToggle = useSelector((state: RootState) => state.filter.selectedToggle);

    // Determine values based on toggle selection
    // When export: Indian Companies = uniqueSuppliers, Foreign Companies = uniqueBuyers
    // When import: Indian Companies = uniqueBuyers, Foreign Companies = uniqueSuppliers
    const indianCompaniesValue = selectedToggle === "export"
        ? (summaryStats?.uniqueSuppliers ? formatNumber(summaryStats.uniqueSuppliers) : "0")
        : (summaryStats?.uniqueBuyers ? formatNumber(summaryStats.uniqueBuyers) : "0");

    const foreignCompaniesValue = selectedToggle === "export"
        ? (summaryStats?.uniqueBuyers ? formatNumber(summaryStats.uniqueBuyers) : "0")
        : (summaryStats?.uniqueSuppliers ? formatNumber(summaryStats.uniqueSuppliers) : "0");

    const uniqueCountriesValue = summaryStats?.uniqueCountry ? formatNumber(summaryStats.uniqueCountry) : "0";

    const statsData = [
        {
            title: "Volume",
            value: summaryStats?.totalQuantity ? `${formatNumber(summaryStats?.totalQuantity)} kg` : "0 kg",
            icon: TrendingUp,
            color: "text-red-500",
            bgColor: "bg-red-50"
        },
        {
            title: "Value",
            value: summaryStats?.totalValueUSD ? `US$ ${formatNumber(summaryStats?.totalValueUSD)}` : "US$ 0.0",
            icon: DollarSign,
            color: "text-amber-500",
            bgColor: "bg-amber-50"
        },
        {
            title: "Avg Price",
            value: summaryStats?.totalQuantity
                ? `US$ ${(summaryStats?.totalValueUSD / summaryStats?.totalQuantity).toFixed(2)}/kg`
                : "US$ 0.00/kg",
            icon: BarChart3,
            color: "text-blue-500",
            bgColor: "bg-blue-50"
        },
        {
            title: "Shipment Count",
            value: summaryStats?.totalRecords ? formatNumber(summaryStats?.totalRecords) : "0",
            icon: Package,
            color: "text-purple-500",
            bgColor: "bg-purple-50"
        },
        {
            title: "Indian Companies",
            value: indianCompaniesValue,
            icon: Building,
            color: "text-emerald-500",
            bgColor: "bg-emerald-50"
        },
        {
            title: "Foreign Companies",
            value: foreignCompaniesValue,
            icon: Building2,
            color: "text-slate-500",
            bgColor: "bg-slate-50"
        },
        {
            title: "Countries",
            value: uniqueCountriesValue,
            icon: Globe2,
            color: "text-cyan-600",
            bgColor: "bg-cyan-50"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="bg-white p-0 border border-gray-200" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                                    <Icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    )
}

export default Stats