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
    const {
        topYears,
        topBuyers,
        topHSCode,
        topSuppliers,
        topCountry,
        topIndianPort,
    } = useSelector((state: RootState) => state.dashboard);

    // Transform quantity data - sorted by quantity descending, top 6
    const yearsByQuantity = useMemo(() => {
        if (!topYears?.length) return null;
        const sortedData = [...topYears]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "year", "quantity");
    }, [topYears]);

    const buyersByQuantity = useMemo(() => {
        if (!topBuyers?.length) return null;
        const sortedData = [...topBuyers]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "buyer", "quantity");
    }, [topBuyers]);

    const supplierByQuantity = useMemo(() => {
        if (!topSuppliers?.length) return null;
        const sortedData = [...topSuppliers]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "supplier", "quantity");
    }, [topSuppliers]);

    const indianPortByQuantity = useMemo(() => {
        if (!topIndianPort?.length) return null;
        const sortedData = [...topIndianPort]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "portOfOrigin", "quantity");
    }, [topIndianPort]);

    const countryByQuantity = useMemo(() => {
        if (!topCountry?.length) return null;
        const sortedData = [...topCountry]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "buyerCountry", "quantity");
    }, [topCountry]);

    const hsCodeByQuantity = useMemo(() => {
        if (!topHSCode?.length) return null;
        const sortedData = [...topHSCode]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "H_S_Code", "quantity");
    }, [topHSCode]);

    // Transform value data - sorted by value descending, top 6
    const yearsByValue = useMemo(() => {
        if (!topYears?.length) return null;
        const sortedData = [...topYears]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "year", "value");
    }, [topYears]);

    const buyersByValue = useMemo(() => {
        if (!topBuyers?.length) return null;
        const sortedData = [...topBuyers]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "buyer", "value");
    }, [topBuyers]);

    const supplierByValue = useMemo(() => {
        if (!topSuppliers?.length) return null;
        const sortedData = [...topSuppliers]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "supplier", "value");
    }, [topSuppliers]);

    const indianPortByValue = useMemo(() => {
        if (!topIndianPort?.length) return null;
        const sortedData = [...topIndianPort]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "portOfOrigin", "value");
    }, [topIndianPort]);

    const countryByValue = useMemo(() => {
        if (!topCountry?.length) return null;
        const sortedData = [...topCountry]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "buyerCountry", "value");
    }, [topCountry]);

    const hsCodeByValue = useMemo(() => {
        if (!topHSCode?.length) return null;
        const sortedData = [...topHSCode]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "H_S_Code", "value");
    }, [topHSCode]);

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
                        yearsByQuantity && buyersByQuantity && supplierByQuantity && indianPortByQuantity && countryByQuantity && hsCodeByQuantity &&
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
                                {yearsByValue && (
                                    <BarChart
                                        title="Top Years By Value"
                                        labels={yearsByValue.labels}
                                        data={yearsByValue.data}
                                        trendData={yearsByValue.trendData}
                                        barLabel="Top Year By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#0ea5e9"
                                        trendColor="#facc15"
                                    />
                                )}
                            </div>
                            <div className="flex gap-5 flex-col md:flex-row">
                                <BarChart
                                    title="Top Buyer By Quantity"
                                    labels={buyersByQuantity.labels}
                                    data={buyersByQuantity.data}
                                    trendData={buyersByQuantity.trendData}
                                    barLabel="Top Buyer By Quantity"
                                    trendLabel="Trendline"
                                    showTrendline={true}
                                    barColor="#0891b2"
                                    trendColor="#c084fc"
                                />
                                {buyersByValue && (
                                    <BarChart
                                        title="Top Buyer By Value"
                                        labels={buyersByValue.labels}
                                        data={buyersByValue.data}
                                        trendData={buyersByValue.trendData}
                                        barLabel="Top Buyer By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#64748b"
                                        trendColor="#f97316"
                                    />
                                )}
                            </div>
                            <div className="flex gap-5 flex-col md:flex-row">
                                <BarChart
                                    title="Top Supplier By Quantity"
                                    labels={supplierByQuantity.labels}
                                    data={supplierByQuantity.data}
                                    trendData={supplierByQuantity.trendData}
                                    barLabel="Top Supplier By Quantity"
                                    trendLabel="Trendline"
                                    showTrendline={true}
                                    barColor="#7c3aed"
                                    trendColor="#f472b6"
                                />
                                {supplierByValue && (
                                    <BarChart
                                        title="Top Supplier By Value"
                                        labels={supplierByValue.labels}
                                        data={supplierByValue.data}
                                        trendData={supplierByValue.trendData}
                                        barLabel="Top Supplier By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#1e40af"
                                        trendColor="#10b981"
                                    />
                                )}
                            </div>
                            <div className="flex gap-5 flex-col md:flex-row">
                                <BarChart
                                    title="Top Indian Port By Quantity"
                                    labels={indianPortByQuantity.labels}
                                    data={indianPortByQuantity.data}
                                    trendData={indianPortByQuantity.trendData}
                                    barLabel="Top Indian Port By Quantity"
                                    trendLabel="Trendline"
                                    showTrendline={true}
                                    barColor="#2563eb"
                                    trendColor="#f87171"
                                />
                                {indianPortByValue && (
                                    <BarChart
                                        title="Top Indian Port By Value"
                                        labels={indianPortByValue.labels}
                                        data={indianPortByValue.data}
                                        trendData={indianPortByValue.trendData}
                                        barLabel="Top Indian Port By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#a855f7"
                                        trendColor="#22d3ee"
                                    />
                                )}
                            </div>
                            <div className="flex gap-5 flex-col md:flex-row">
                                <BarChart
                                    title="Top Country By Quantity"
                                    labels={countryByQuantity.labels}
                                    data={countryByQuantity.data}
                                    trendData={countryByQuantity.trendData}
                                    barLabel="Top Country By Quantity"
                                    trendLabel="Trendline"
                                    showTrendline={true}
                                    barColor="#14b8a6"
                                    trendColor="#eab308"
                                />
                                {countryByValue && (
                                    <BarChart
                                        title="Top Country By Value"
                                        labels={countryByValue.labels}
                                        data={countryByValue.data}
                                        trendData={countryByValue.trendData}
                                        barLabel="Top Country By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#8b5cf6"
                                        trendColor="#34d399"
                                    />
                                )}
                            </div>
                            <div className="flex gap-5 flex-col md:flex-row">
                                <BarChart
                                    title="Top HS Code By Quantity"
                                    labels={hsCodeByQuantity.labels}
                                    data={hsCodeByQuantity.data}
                                    trendData={hsCodeByQuantity.trendData}
                                    barLabel="Top HS Code By Quantity"
                                    trendLabel="Trendline"
                                    showTrendline={true}
                                    barColor="#334155"
                                    trendColor="#2dd4bf"
                                />
                                {hsCodeByValue && (
                                    <BarChart
                                        title="Top HS Code By Value"
                                        labels={hsCodeByValue.labels}
                                        data={hsCodeByValue.data}
                                        trendData={hsCodeByValue.trendData}
                                        barLabel="Top HS Code By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#fda4af"
                                        trendColor="#1e293b"
                                    />
                                )}
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