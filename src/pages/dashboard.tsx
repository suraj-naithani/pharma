import Stats from "@/components/Stats";
import AppliedFilters from "@/components/AppliedFilters";
import type { RootState } from "@/redux/store";
import { transformDynamicData } from "@/utils/helper";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import BarChart from "../components/BarChart";
import FilterSection from '../components/FilterSection';
import FilterSidebar from "../components/FilterSidebar";
import ShipmentTable from '../components/ShipmentTable';

const Dashboard = () => {
    const {
        topBuyersByQuantity,
        topBuyersByValue,
        topYearsByQuantity,
        topYearsByValue,
        topHSCodeByQuantity,
        topHSCodeByValue,
        topSuppliersByQuantity,
        topSuppliersByValue,
        topCountryByQuantity,
        topCountryByValue,
        topIndianPortByQuantity,
        topIndianPortByValue
    } = useSelector((state: RootState) => state.dashboard);

    // Transform quantity data - sorted by quantity descending, top 6
    const yearsByQuantity = useMemo(() => {
        if (!topYearsByQuantity?.length) return null;
        const sortedData = [...topYearsByQuantity]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "year", "quantity");
    }, [topYearsByQuantity]);

    const buyersByQuantity = useMemo(() => {
        if (!topBuyersByQuantity?.length) return null;
        const sortedData = [...topBuyersByQuantity]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "buyer", "quantity");
    }, [topBuyersByQuantity]);

    const supplierByQuantity = useMemo(() => {
        if (!topSuppliersByQuantity?.length) return null;
        const sortedData = [...topSuppliersByQuantity]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "supplier", "quantity");
    }, [topSuppliersByQuantity]);

    const indianPortByQuantity = useMemo(() => {
        if (!topIndianPortByQuantity?.length) return null;
        const sortedData = [...topIndianPortByQuantity]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "portOfOrigin", "quantity");
    }, [topIndianPortByQuantity]);

    const countryByQuantity = useMemo(() => {
        if (!topCountryByQuantity?.length) return null;
        const sortedData = [...topCountryByQuantity]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "buyerCountry", "quantity");
    }, [topCountryByQuantity]);

    const hsCodeByQuantity = useMemo(() => {
        if (!topHSCodeByQuantity?.length) return null;
        const sortedData = [...topHSCodeByQuantity]
            .sort((a, b) => (b.totalQuantity || 0) - (a.totalQuantity || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "H_S_Code", "quantity");
    }, [topHSCodeByQuantity]);

    // Transform value data - sorted by value descending, top 6
    const yearsByValue = useMemo(() => {
        if (!topYearsByValue?.length) return null;
        const sortedData = [...topYearsByValue]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "year", "value");
    }, [topYearsByValue]);

    const buyersByValue = useMemo(() => {
        if (!topBuyersByValue?.length) return null;
        const sortedData = [...topBuyersByValue]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "buyer", "value");
    }, [topBuyersByValue]);

    const supplierByValue = useMemo(() => {
        if (!topSuppliersByValue?.length) return null;
        const sortedData = [...topSuppliersByValue]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "supplier", "value");
    }, [topSuppliersByValue]);

    const indianPortByValue = useMemo(() => {
        if (!topIndianPortByValue?.length) return null;
        const sortedData = [...topIndianPortByValue]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "portOfOrigin", "value");
    }, [topIndianPortByValue]);

    const countryByValue = useMemo(() => {
        if (!topCountryByValue?.length) return null;
        const sortedData = [...topCountryByValue]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "buyerCountry", "value");
    }, [topCountryByValue]);

    const hsCodeByValue = useMemo(() => {
        if (!topHSCodeByValue?.length) return null;
        const sortedData = [...topHSCodeByValue]
            .sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0))
            .slice(0, 6);
        return transformDynamicData(sortedData, "H_S_Code", "value");
    }, [topHSCodeByValue]);

    return (
        <div className='bg-[#EEF2FF] w-full min-h-[100vh] '>
            <FilterSection />

            <div className="w-full px-6 py-3">
                <Stats />
            </div>

            <AppliedFilters />

            <section className="w-full flex flex-col gap-3 md:flex-row p-6 pt-0">
                <FilterSidebar />

                <div className="flex-6 w-full flex flex-col gap-5 overflow-hidden">
                    {
                        (yearsByQuantity || buyersByQuantity || supplierByQuantity || indianPortByQuantity || countryByQuantity || hsCodeByQuantity || yearsByValue || buyersByValue || supplierByValue || indianPortByValue || countryByValue || hsCodeByValue) &&
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3 flex-col lg:flex-row">
                                {yearsByQuantity && yearsByQuantity.labels && yearsByQuantity.labels.length > 0 && (
                                    <BarChart
                                        title="Top Years By Quantity"
                                        labels={yearsByQuantity.labels}
                                        data={yearsByQuantity.data}
                                        trendData={yearsByQuantity.trendData}
                                        barLabel="Top Year By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#3b82f6"
                                        trendColor="#06b6d4"
                                    />
                                )}
                                {yearsByValue && yearsByValue.labels && yearsByValue.labels.length > 0 && (
                                    <BarChart
                                        title="Top Years By Value"
                                        labels={yearsByValue.labels}
                                        data={yearsByValue.data}
                                        trendData={yearsByValue.trendData}
                                        barLabel="Top Year By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#10b981"
                                        trendColor="#f59e0b"
                                    />
                                )}
                            </div>
                            <div className="flex gap-3 flex-col lg:flex-row">
                                {buyersByQuantity && buyersByQuantity.labels && buyersByQuantity.labels.length > 0 && (
                                    <BarChart
                                        title="Top Buyer By Quantity"
                                        labels={buyersByQuantity.labels}
                                        data={buyersByQuantity.data}
                                        trendData={buyersByQuantity.trendData}
                                        barLabel="Top Buyer By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#6366f1"
                                        trendColor="#10b981"
                                    />
                                )}
                                {buyersByValue && buyersByValue.labels && buyersByValue.labels.length > 0 && (
                                    <BarChart
                                        title="Top Buyer By Value"
                                        labels={buyersByValue.labels}
                                        data={buyersByValue.data}
                                        trendData={buyersByValue.trendData}
                                        barLabel="Top Buyer By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#8b5cf6"
                                        trendColor="#f59e0b"
                                    />
                                )}
                            </div>
                            <div className="flex gap-3 flex-col lg:flex-row">
                                {supplierByQuantity && supplierByQuantity.labels && supplierByQuantity.labels.length > 0 && (
                                    <BarChart
                                        title="Top Supplier By Quantity"
                                        labels={supplierByQuantity.labels}
                                        data={supplierByQuantity.data}
                                        trendData={supplierByQuantity.trendData}
                                        barLabel="Top Supplier By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#06b6d4"
                                        trendColor="#ef4444"
                                    />
                                )}
                                {supplierByValue && supplierByValue.labels && supplierByValue.labels.length > 0 && (
                                    <BarChart
                                        title="Top Supplier By Value"
                                        labels={supplierByValue.labels}
                                        data={supplierByValue.data}
                                        trendData={supplierByValue.trendData}
                                        barLabel="Top Supplier By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#14b8a6"
                                        trendColor="#f97316"
                                    />
                                )}
                            </div>
                            <div className="flex gap-3 flex-col lg:flex-row">
                                {indianPortByQuantity && indianPortByQuantity.labels && indianPortByQuantity.labels.length > 0 && (
                                    <BarChart
                                        title="Top Indian Port By Quantity"
                                        labels={indianPortByQuantity.labels}
                                        data={indianPortByQuantity.data}
                                        trendData={indianPortByQuantity.trendData}
                                        barLabel="Top Indian Port By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#dc2626"
                                        trendColor="#06b6d4"
                                    />
                                )}
                                {indianPortByValue && indianPortByValue.labels && indianPortByValue.labels.length > 0 && (
                                    <BarChart
                                        title="Top Indian Port By Value"
                                        labels={indianPortByValue.labels}
                                        data={indianPortByValue.data}
                                        trendData={indianPortByValue.trendData}
                                        barLabel="Top Indian Port By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#7c3aed"
                                        trendColor="#10b981"
                                    />
                                )}
                            </div>
                            <div className="flex gap-3 flex-col lg:flex-row">
                                {countryByQuantity && countryByQuantity.labels && countryByQuantity.labels.length > 0 && (
                                    <BarChart
                                        title="Top Country By Quantity"
                                        labels={countryByQuantity.labels}
                                        data={countryByQuantity.data}
                                        trendData={countryByQuantity.trendData}
                                        barLabel="Top Country By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#0891b2"
                                        trendColor="#f59e0b"
                                    />
                                )}
                                {countryByValue && countryByValue.labels && countryByValue.labels.length > 0 && (
                                    <BarChart
                                        title="Top Country By Value"
                                        labels={countryByValue.labels}
                                        data={countryByValue.data}
                                        trendData={countryByValue.trendData}
                                        barLabel="Top Country By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#a855f7"
                                        trendColor="#06b6d4"
                                    />
                                )}
                            </div>
                            <div className="flex gap-3 flex-col lg:flex-row">
                                {hsCodeByQuantity && hsCodeByQuantity.labels && hsCodeByQuantity.labels.length > 0 && (
                                    <BarChart
                                        title="Top HS Code By Quantity"
                                        labels={hsCodeByQuantity.labels}
                                        data={hsCodeByQuantity.data}
                                        trendData={hsCodeByQuantity.trendData}
                                        barLabel="Top HS Code By Quantity"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#64748b"
                                        trendColor="#10b981"
                                    />
                                )}
                                {hsCodeByValue && hsCodeByValue.labels && hsCodeByValue.labels.length > 0 && (
                                    <BarChart
                                        title="Top HS Code By Value"
                                        labels={hsCodeByValue.labels}
                                        data={hsCodeByValue.data}
                                        trendData={hsCodeByValue.trendData}
                                        barLabel="Top HS Code By Value"
                                        trendLabel="Trendline"
                                        showTrendline={true}
                                        barColor="#f87171"
                                        trendColor="#3b82f6"
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