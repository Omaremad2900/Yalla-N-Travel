import React, { useState, useEffect } from "react";
import SellerSideNav from "../components/SellerSideNav"; // Import the Seller SideNav component

const SellerRevenue = ({ SellerService }) => {
    const [month, setMonth] = useState(""); // Default to empty month
    const [productName, setProductName] = useState(""); // Product Name filter
    const [startDate, setStartDate] = useState(""); // Start date filter
    const [endDate, setEndDate] = useState(""); // End date filter
    const [revenueData, setRevenueData] = useState({
        revenue: 0,
        totalProducts: 0,
        products: [], // Add products array
    });
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                // Construct query parameters based on available filters
                const queryParams = {};
                if (productName) queryParams.productName = productName;
                if (startDate) queryParams.startDate = startDate;
                if (endDate) queryParams.endDate = endDate;
                if (month) queryParams.month = parseInt(month, 10);

                const response = await SellerService.getSellerRevenue(queryParams);
                console.log("API Response for Revenue Data:", response);

                // Ensure the response structure is correctly mapped
                if (response && response.data) {
                    setRevenueData(response.data); // Map `data` from the response
                } else {
                    setRevenueData({ revenue: 0, totalProducts: 0, products: [] }); // Fallback in case of missing data
                }
            } catch (err) {
                console.error("Error fetching revenue data:", err); // Log the error
                setError(err.message || "Failed to fetch revenue data");
            }
        };

        fetchRevenueData();
    }, [productName, startDate, endDate, month, SellerService]);

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <SellerSideNav />

            {/* Main Content */}
            <div className="flex-1 p-6">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
                        Seller Revenue Dashboard
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
                            <h3 className="text-xl font-semibold text-green-700">Total Revenue</h3>
                            <p className="text-2xl font-bold text-green-900">
                                ${revenueData.totalRevenue}
                            </p>
                        </div>

                        <div className="p-4 bg-blue-100 border border-blue-300 rounded-lg">
                            <h3 className="text-xl font-semibold text-blue-700">Total Products Sold</h3>
                            <p className="text-2xl font-bold text-blue-900">{revenueData.totalSales}</p>
                        </div>
                    </div>

                    {/* Products Data */}
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Products Breakdown</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {revenueData.products.map((product, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                                >
                                    <h4 className="text-lg font-semibold text-gray-800">
                                        {product.productName}
                                    </h4>
                                    <p className="text-gray-600">
                                        Sales Count:{" "}
                                        <span className="font-bold">{product.salesCount}</span>
                                    </p>
                                    <p className="text-gray-600">
                                        Revenue:{" "}
                                        <span className="font-bold">${product.revenue.toFixed(2)}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerRevenue;
