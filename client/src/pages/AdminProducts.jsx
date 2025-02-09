import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from "../components/ProductCard";
import SideNav from '../components/adminSidenav';
import { ProSidebarProvider } from 'react-pro-sidebar';
import ProductService from '../services/ProductService';



const AdminProducts = ( ) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedFilterValue1, setSelectedFilterValue1] = useState("");
  const [selectedFilterValue2, setSelectedFilterValue2] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // const [productStatus,setProductStatus]= useState(product.productStatus);
  const itemsPerPage = 10; // Change this as needed

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getAllProducts(currentPage, itemsPerPage, 'all');
        console.log(response);
        if (response.success) {
          const products = response.data.products.products || [];
          setProducts(products);
        //   setRawPrices(products.map(product => product.price));
          setFilteredProducts(products);
          setTotalPages(response.data.products.pagination.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, [ProductService, currentPage]);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filterAndSortProducts = () => {
    let updatedProducts = [...products];
    if (searchTerm.trim()) {
      updatedProducts = updatedProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }

    const minPrice = parseFloat(selectedFilterValue1);
    const maxPrice = parseFloat(selectedFilterValue2);
    updatedProducts = updatedProducts.filter(product => {
      const price = parseFloat(product.price);
      return (!isNaN(minPrice) ? price >= minPrice : true) &&
             (!isNaN(maxPrice) ? price <= maxPrice : true);
    });

    if (selectedSort === "asc") {
      updatedProducts.sort((a, b) => a.rating - b.rating);
    } else if (selectedSort === "desc") {
      updatedProducts.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(updatedProducts);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    filterAndSortProducts();
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
    filterAndSortProducts();
  };

  const handleFilterChange1 = (e) => setSelectedFilterValue1(e.target.value);
  const handleFilterChange2 = (e) => setSelectedFilterValue2(e.target.value);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <ProSidebarProvider>
      <div className="flex bg-slate-100 min-h-screen">
        <SideNav />
        <div className="flex-1 p-6 ml-auto">
          <h3 className="text-3xl font-semibold text-slate-700 mb-6">Products</h3>

          <form className="flex flex-col md:flex-row gap-4 mb-6 items-center" onSubmit={handleSearch}>
            <div className="flex w-full md:w-auto">
              <input
                type="text"
                placeholder="Search by product name"
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full md:w-60 px-3 py-2 rounded-l-lg border-2 border-slate-600 focus:outline-none"
              />
              <button type="button" className="bg-slate-600 text-white rounded-r-lg px-4 py-2 hover:bg-slate-500" onClick={filterAndSortProducts}>
                Search
              </button>
            </div>

            <div className="w-full md:w-auto">
              <select
                id="ratingType"
                name="selectedSort"
                value={selectedSort}
                onChange={handleSortChange}
                className="w-full md:w-48 px-3 py-2 rounded-lg border-2 border-slate-600 focus:outline-none bg-white text-slate-400"
              >
                <option value="">Sort by rating</option>
                <option value="asc">From highest to lowest</option>
                <option value="desc">From lowest to highest</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Min price"
                value={selectedFilterValue1}
                onChange={handleFilterChange1}
                className="w-full md:w-40 px-3 py-2 rounded-lg border-2 border-slate-600 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Max price"
                value={selectedFilterValue2}
                onChange={handleFilterChange2}
                className="w-full md:w-40 px-3 py-2 rounded-lg border-2 border-slate-600 focus:outline-none"
              />
              <button type="submit" className="bg-slate-600 text-white rounded-lg px-4 py-2 hover:bg-slate-500">
                Filter
              </button>
            </div>
          </form>

          {filteredProducts.length === 0 ? (
            <p className="text-slate-600">No products found</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={idx} product={product} loggedInUser={loggedInUser} />
              ))}
            </ul>
          )}

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-600 text-white rounded-l-lg hover:bg-slate-500"
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-slate-200 text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-600 text-white rounded-r-lg hover:bg-slate-500"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </ProSidebarProvider>
  );
};

export default AdminProducts;
