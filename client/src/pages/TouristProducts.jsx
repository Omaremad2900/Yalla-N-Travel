import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ProductCardTourist from "../components/ProductCardTourist";
import TouristSideNav from '../components/TouristSideNav';
import { ProSidebarProvider } from 'react-pro-sidebar';
import CurrencyConverter from '../utils/currencyConverter';

const TouristProducts = ({ ProductService }) => {
  const loggedInUser = useSelector((state) => state.user.currentUser);
  const [rawPrices, setRawPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedFilterValue1, setSelectedFilterValue1] = useState("");
  const [selectedFilterValue2, setSelectedFilterValue2] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [currency, setCurrency] = useState('USD');
  const [convertedPrices, setConvertedPrices] = useState([]);
  const [review,setReview]=useState([]);

  // Fetch products when component mounts or currentPage changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getAllProducts(currentPage, itemsPerPage, 'unarchived');
        if (response.success) {
          const products = response.data.products.products || [];
          setProducts(products);
          setRawPrices(products.map(product => product.price));
          setFilteredProducts(products);
          setTotalPages(response.data.products.pagination.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, [ProductService, currentPage]);

//   useEffect(()=>{
//     const GetReview= async() =>{
//         try{
//             const response=await ProductService.getReview( );
//             console.log(response);
//             if(response.success){
//                 console.log(response.data);
//                 setReview(response.data.comment);
//                 console.log(review);

//             }
//         }
//         catch(error){
//             console.error("Failed to get product's review ", error);
//         }
//     };
//     GetReview();
// },[ProductService]);

  // Filter and sort products when searchTerm, selectedSort, or filters change
  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedSort, selectedFilterValue1, selectedFilterValue2]);

  // Update filtered products when convertedPrices are ready
  useEffect(() => {
    if (convertedPrices.length > 0) {
      const updatedProducts = products.map((product, idx) => ({
        ...product,
        price: convertedPrices[idx] || product.price,
      }));
      setFilteredProducts(updatedProducts);
    }
  }, [convertedPrices, products]);

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

  const handleCurrencyChange = (newCurrency, newConvertedPrices) => {
    setCurrency(newCurrency);
    setConvertedPrices(newConvertedPrices);
  };

  return (
    <ProSidebarProvider>
      <div className="flex bg-slate-100 min-h-screen">
        <TouristSideNav />
        <div className="w-3/4 p-6 ml-auto">
          <h3 className="text-3xl font-semibold text-slate-700 mb-6">Products</h3>
          <CurrencyConverter
            defaultCurrency={currency}
            prices={rawPrices}  // Pass raw prices to CurrencyConverter
            onCurrencyChange={handleCurrencyChange}
          />

          {/* Search, sort, and filter form */}
          <form className="flex flex-col md:flex-row gap-4 mb-6 items-center" onSubmit={(e) => { e.preventDefault(); filterAndSortProducts(); }}>
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
                onChange={(e) => setSelectedSort(e.target.value)}
                className="w-full md:w-48 px-3 py-2 rounded-lg border-2 border-slate-600 focus:outline-none bg-white text-slate-400"
              >
                <option value="">Sort by rating</option>
                <option value="asc">From highest to lowest</option>
                <option value="desc">From lowest to highest</option>
              </select>
            </div>
            {/* Price filter inputs */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Min price"
                value={selectedFilterValue1}
                onChange={(e) => setSelectedFilterValue1(e.target.value)}
                className="w-full md:w-40 px-3 py-2 rounded-lg border-2 border-slate-600 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Max price"
                value={selectedFilterValue2}
                onChange={(e) => setSelectedFilterValue2(e.target.value)}
                className="w-full md:w-40 px-3 py-2 rounded-lg border-2 border-slate-600 focus:outline-none"
              />
              <button type="submit" className="bg-slate-600 text-white rounded-lg px-4 py-2 hover:bg-slate-500">
                Filter
              </button>
            </div>
          </form>

          {/* Product cards */}
          {filteredProducts.length === 0 ? (
            <p className="text-slate-600">No products found</p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCardTourist 
                  key={idx} 
                  product={product} 
                  loggedInUser={loggedInUser} 
                  currency={currency} 
                />
              ))}
            </ul>
          )}
          
          {/* Pagination controls */}
          <div className="flex justify-center mt-6">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 bg-slate-600 text-white rounded-l-lg hover:bg-slate-500">
              Previous
            </button>
            <span className="px-4 py-2 bg-slate-200 text-slate-700">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 bg-slate-600 text-white rounded-r-lg hover:bg-slate-500">
              Next
            </button>
          </div>
        </div>
      </div>
    </ProSidebarProvider>
  );
};

export default TouristProducts;
