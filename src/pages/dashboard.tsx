import Stats from "@/components/Stats";
import BarChart from "../components/BarChart";
import FilterSection from '../components/FilterSection';
import FilterSidebar from "../components/FilterSidebar";
import ShipmentTable from '../components/ShipmentTable';
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useMemo } from "react";
import { transformDynamicData } from "@/utils/helper";

const Dashboard = () => {
    const { topYearsByQuantity, topBuyersByQuantity, topHSCodeByQuantity, topSuppliersByQuantity, topCountryByQuantity, topIndianPortByQuantity, topBuyersByValue, topYearsByValue, topHSCodeByValue, topSuppliersByValue, topCountryByValue, topIndianPortByValue } = useSelector((state: RootState) => state.dashboard);

    const yearsByQuantity = useMemo(() => {
        if (!topYearsByQuantity?.length) return null;
        return transformDynamicData(topYearsByQuantity, "year");
    }, [topYearsByQuantity]);

    const yearsByValue = useMemo(() => {
        if (!topYearsByValue?.length) return null;
        return transformDynamicData(topYearsByValue, "year");
    }, [topYearsByValue]);

    const buyersByQuantity = useMemo(() => {
        if (!topBuyersByQuantity?.length) return null;
        return transformDynamicData(topBuyersByQuantity, "buyer");
    }, [topBuyersByQuantity]);

    const buyersByValue = useMemo(() => {
        if (!topBuyersByValue?.length) return null;
        return transformDynamicData(topBuyersByValue, "buyer");
    }, [topBuyersByValue]);

    const supplierByQuantity = useMemo(() => {
        if (!topSuppliersByQuantity?.length) return null;
        return transformDynamicData(topSuppliersByQuantity, "buyer");
    }, [topSuppliersByQuantity]);

    const supplierByValue = useMemo(() => {
        if (!topSuppliersByValue?.length) return null;
        return transformDynamicData(topSuppliersByValue, "buyer");
    }, [topSuppliersByValue]);

    const indianPortByQuantity = useMemo(() => {
        if (!topIndianPortByQuantity?.length) return null;
        return transformDynamicData(topIndianPortByQuantity, "buyer");
    }, [topIndianPortByQuantity]);

    const indianPortByValue = useMemo(() => {
        if (!topIndianPortByValue?.length) return null;
        return transformDynamicData(topIndianPortByValue, "buyer");
    }, [topIndianPortByValue]);

    const countryByQuantity = useMemo(() => {
        if (!topCountryByQuantity?.length) return null;
        return transformDynamicData(topCountryByQuantity, "buyer");
    }, [topCountryByQuantity]);

    const countryByValue = useMemo(() => {
        if (!topCountryByValue?.length) return null;
        return transformDynamicData(topCountryByValue, "buyer");
    }, [topCountryByValue]);

    const hsCodeByQuantity = useMemo(() => {
        if (!topHSCodeByQuantity?.length) return null;
        return transformDynamicData(topHSCodeByQuantity, "buyer");
    }, [topHSCodeByQuantity]);

    const hsCodeByValue = useMemo(() => {
        if (!topHSCodeByValue?.length) return null;
        return transformDynamicData(topHSCodeByValue, "buyer");
    }, [topHSCodeByValue]);

    return (
        <div className='bg-[#f9fafb] w-full min-h-[100vh] '>
            <FilterSection />

            <div className="w-full px-6 py-3 bg-gray-50">
                <Stats />
            </div>

            <section className="w-full flex flex-col gap-5 md:flex-row p-6">
                <FilterSidebar />

                <div className="flex-6 w-full flex flex-col gap-5 overflow-hidden">
                    {
                        yearsByQuantity && yearsByValue && buyersByQuantity && buyersByValue && supplierByQuantity && supplierByValue && indianPortByQuantity && indianPortByValue && countryByQuantity && countryByValue && hsCodeByQuantity && hsCodeByValue &&
                            <div className="flex flex-col gap-5">
                                <div className="flex gap-5 flex-col md:flex-row">
                                    <BarChart
                                        title="Top Years By Quantity"
                                        labels={yearsByQuantity.labels}
                                        data={yearsByQuantity.data}
                                        trendData={yearsByQuantity.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#6366f1"
                                        trendColor="#10b981"
                                    />
                                    <BarChart
                                        title="Top Years By Value"
                                        labels={yearsByValue.labels}
                                        data={yearsByValue.data}
                                        trendData={yearsByValue.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#0ea5e9"
                                        trendColor="#facc15"
                                    />
                                </div>
                                <div className="flex gap-5 flex-col md:flex-row">
                                    <BarChart
                                        title="Top Buyer By Quantity"
                                        labels={buyersByQuantity.labels}
                                        data={buyersByQuantity.data}
                                        trendData={buyersByQuantity.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#0891b2"
                                        trendColor="#c084fc"
                                    />
                                    <BarChart
                                        title="Top Buyer By Value"
                                        labels={buyersByValue.labels}
                                        data={buyersByValue.data}
                                        trendData={buyersByValue.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#64748b"
                                        trendColor="#f97316"
                                    />
                                </div>
                                <div className="flex gap-5 flex-col md:flex-row">
                                    <BarChart
                                        title="Top Supplier By Quantity"
                                        labels={supplierByQuantity.labels}
                                        data={supplierByQuantity.data}
                                        trendData={supplierByQuantity.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#7c3aed"
                                        trendColor="#f472b6"
                                    />
                                    <BarChart
                                        title="Top Supplier By Value"
                                        labels={supplierByValue.labels}
                                        data={supplierByValue.data}
                                        trendData={supplierByValue.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#1e40af"
                                        trendColor="#10b981"
                                    />
                                </div>
                                <div className="flex gap-5 flex-col md:flex-row">
                                    <BarChart
                                        title="Top Indian Port By Quantity"
                                        labels={indianPortByQuantity.labels}
                                        data={indianPortByQuantity.data}
                                        trendData={indianPortByQuantity.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#2563eb"
                                        trendColor="#f87171"
                                    />
                                    <BarChart
                                        title="Top Indian Port By Value"
                                        labels={indianPortByValue.labels}
                                        data={indianPortByValue.data}
                                        trendData={indianPortByValue.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#a855f7"
                                        trendColor="#22d3ee"
                                    />
                                </div>
                                <div className="flex gap-5 flex-col md:flex-row">
                                    <BarChart
                                        title="Top Country By Quantity"
                                        labels={countryByQuantity.labels}
                                        data={countryByQuantity.data}
                                        trendData={countryByQuantity.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#14b8a6"
                                        trendColor="#eab308"
                                    />
                                    <BarChart
                                        title="Top Country By Value"
                                        labels={countryByValue.labels}
                                        data={countryByValue.data}
                                        trendData={countryByValue.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#8b5cf6"
                                        trendColor="#34d399"
                                    />
                                </div>
                                <div className="flex gap-5 flex-col md:flex-row">
                                    <BarChart
                                        title="Top HS Code By Quantity"
                                        labels={hsCodeByQuantity.labels}
                                        data={hsCodeByQuantity.data}
                                        trendData={hsCodeByQuantity.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#334155"
                                        trendColor="#2dd4bf"
                                    />
                                    <BarChart
                                        title="Top HS Code By Value"
                                        labels={hsCodeByValue.labels}
                                        data={hsCodeByValue.data}
                                        trendData={hsCodeByValue.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#fda4af"
                                        trendColor="#1e293b"
                                    />
                                </div>
                            </div>
                    }
                    <ShipmentTable />
                </div>
            </section>
        </div>

    )
}

export default Dashboard