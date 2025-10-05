import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RootState } from "@/redux/store";
import { formatNumber } from "@/utils/helper";
import { BarChart3, Building, Building2, DollarSign, Package, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";

const Stats = () => {
    const summaryStats = useSelector((state: RootState) => state.dashboard.summary);

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card className="bg-white shadow-sm !py-3 border-none">
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-600 mb-1">Volume</p>
                                <div className={cn(
                                    "p-2.5 rounded-xl",
                                    "bg-gradient-to-br",
                                    "from-red-50 via-rose-50 to-pink-50"
                                )}>
                                    <TrendingUp className={cn("w-5 h-5", "text-red-500")} />
                                </div>
                            </div>
                            <p className="text-lg font-bold">{summaryStats?.totalQuantity ? formatNumber(summaryStats?.totalQuantity) : "0"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-white shadow-sm !py-3 border-none">
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-600 mb-1">Value</p>
                                <div className={cn(
                                    "p-2.5 rounded-xl",
                                    "bg-gradient-to-br",
                                    "from-amber-50 via-yellow-50 to-orange-50"
                                )}>
                                    <DollarSign className={cn("w-5 h-5", "text-amber-500")} />
                                </div>
                            </div>
                            <p className="text-lg font-bold">${summaryStats?.totalValueUSD ? formatNumber(summaryStats?.totalValueUSD) : "0.0"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-white shadow-sm !py-3 border-none">
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-600 mb-1">Avg Price</p>
                                <div className={cn(
                                    "p-2.5 rounded-xl",
                                    "bg-gradient-to-br",
                                    "from-blue-50 via-sky-50 to-cyan-50"
                                )}>
                                    <BarChart3 className={cn("w-5 h-5", "text-blue-500")} />
                                </div>
                            </div>
                            <p className="text-lg font-bold">{summaryStats?.totalQuantity ? (summaryStats?.totalValueUSD / summaryStats?.totalQuantity).toFixed(2) : "0.00"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-white shadow-sm !py-3 border-none">
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-600 mb-1">Shipment Count</p>
                                <div className={cn(
                                    "p-2.5 rounded-xl",
                                    "bg-gradient-to-br",
                                    "from-purple-50 via-violet-50 to-indigo-50"
                                )}>
                                    <Package className={cn("w-5 h-5", "text-purple-500")} />
                                </div>
                            </div>
                            <p className="text-lg font-bold">{summaryStats?.totalRecords ? formatNumber(summaryStats?.totalRecords) : "0"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-white shadow-sm !py-3 border-none">
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-600 mb-1">Indian Companies</p>
                                <div className={cn(
                                    "p-2.5 rounded-xl",
                                    "bg-gradient-to-br",
                                    "from-emerald-50 via-green-50 to-teal-50"
                                )}>
                                    <Building className={cn("w-5 h-5", "text-emerald-500")} />
                                </div>
                            </div>
                            <p className="text-lg font-bold">{summaryStats?.totalQuantity ? formatNumber(summaryStats?.totalQuantity) : "0"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
                <Card className="bg-white shadow-sm !py-3 border-none">
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col w-full">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium text-gray-600 mb-1">Foreign Companies</p>
                                <div className={cn(
                                    "p-2.5 rounded-xl",
                                    "bg-gradient-to-br",
                                    "from-slate-50 via-gray-50 to-zinc-50"
                                )}>
                                    <Building2 className={cn("w-5 h-5", "text-slate-500")} />
                                </div>
                            </div>
                            <p className="text-lg font-bold">{summaryStats?.totalQuantity ? formatNumber(summaryStats?.totalQuantity) : "0"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Stats