import React, { useState, useEffect } from "react";
import AdminSideNav from "../components/adminSidenav"; // Import the Admin SideNav component

const AdminRevenue = ({ AdminService }) => {
    const [month, setMonth] = useState(""); // Month filter (optional)
    const [productName, setProductName] = useState(""); // Product Name filter (optional)
    const [startDate, setStartDate] = useState(""); // Start Date filter
    const [endDate, setEndDate] = useState(""); // End Date filter
    const [revenueData, setRevenueData] = useState({
        activityRevenue: 0,
        itineraryRevenue: 0,
        productRevenue: 0,
        totalRevenue: 0,
    }); // Revenue Data
    const [error, setError] = useState(""); // Error handling

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                // Construct filters object
                const filters = {};
                if (productName) filters.productName = productName;
                if (startDate) filters.startDate = startDate;
                if (endDate) filters.endDate = endDate;
                if (month) filters.month = month;

                // Fetch data from API
                const data = await AdminService.getAdminRevenue(filters);
                console.log("Admin Revenue API Response:", data); // Debugging log
                if (data && data.data) {
                    setRevenueData(data.data); // Set revenue data
                } else {
                    setRevenueData({
                        activityRevenue: 0,
                        itineraryRevenue: 0,
                        productRevenue: 0,
                        totalRevenue: 0,
                    }); // Fallback in case of missing data
                }
            } catch (err) {
                console.error("Error fetching revenue data:", err); // Log error
                setError(err.message || "Failed to fetch revenue data");
            }
        };

        fetchRevenueData();
    }, [productName, startDate, endDate, month, AdminService]); // Re-run on filter changes

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <AdminSideNav />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
                        Admin Revenue Dashboard
                    </h1>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    {/* Filters Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label htmlFor="productName" className="block text-gray-700 font-semibold mb-2">
                                Product Name:
                            </label>
                            <input
                                type="text"
                                id="productName"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Enter Product Name"
                                className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
<br/>
                        <div>
                            <label htmlFor="startDate" className="block text-gray-700 font-semibold mb-2">
                                Start Date:
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-gray-700 font-semibold mb-2">
                                End Date:
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="border border-gray-300 rounded-lg p-3 w-full shadow-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Revenue Data */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                            <h3 className="text-xl font-semibold text-green-700">Activity Revenue</h3>
                            <p className="text-2xl font-bold text-green-900">
                                ${revenueData.activityRevenue.toFixed(2)}
                            </p>
                        </div>

                        <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
                            <h3 className="text-xl font-semibold text-blue-700">Itinerary Revenue</h3>
                            <p className="text-2xl font-bold text-blue-900">
                                ${revenueData.itineraryRevenue.toFixed(2)}
                            </p>
                        </div>

                        <div className="p-4 bg-purple-100 border border-purple-300 rounded-lg">
                            <h3 className="text-xl font-semibold text-purple-700">Product Revenue</h3>
                            <p className="text-2xl font-bold text-purple-900">
                                ${revenueData.productRevenue.toFixed(2)}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-700">Total Revenue</h3>
                            <p className="text-2xl font-bold text-gray-900">
                                ${revenueData.totalRevenue.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRevenue;
