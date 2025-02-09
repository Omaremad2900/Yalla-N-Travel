import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductService from "../services/ProductService";

export default function Products({ProductService}) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("no search yet");
  const [selectedFilterValue1, setSelectedFilterValue1] = useState("Filter by price");
  const [selectedFilterValue2, setSelectedFilterValue2] = useState("Filter by price");
  const [selectedSort, setSelectedSort] = useState("Filter by sort");

  // Fetch products data when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await ProductService.getAllProducts();
        console.log(response);
        if (response && response.status === "success") {
          // Access the products array from the response
          setProducts(response.data.products || []);
          setFilteredProducts(response.data.products || []); // Optionally set filteredProducts here
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

   // Handle input change for sort
   const handleChangeSort = (event) => {
     setSelectedSort(event.target.value);
      console.log(selectedSort);
    
  };

  //Sort products
  useEffect(() => {
    const sortProducts = async () => {
      console.log(selectedSort);
      if (selectedSort === "Sort by rating") {
        console.log("Sort term empty, showing all products");
        setFilteredProducts(products); // Show all products if sort is empty
        return;
      }
  
      try {
        const response = await ProductService.sortProduct(selectedSort);
        console.log(response);
        if (response && response.status === "success") {
          // Access the products array from the response
          setProducts(response.data.products || []);
          setFilteredProducts(response.data.products || []); // Optionally set filteredProducts here
        }
      } catch (error) {
        console.error("Failed to sort products", error);
      }
    };
    sortProducts();
  }, [selectedSort]);


   // Handle input change for filter
   const handleChangeFilter1 = (event) => {
     setSelectedFilterValue1(event.target.value);
      console.log(selectedFilterValue1);
    
  };

  // Handle input change for filter
  const handleChangeFilter2 = (event) => {
    setSelectedFilterValue2(event.target.value);
    console.log(selectedFilterValue2);
  
};
  //Filter products data 
  useEffect(() => {
    const filterProducts = async () => {
      if (selectedFilterValue1 === "Filter by price" && selectedFilterValue2 === "Filter by price") {
        console.log("Filter term empty, showing all products");
        setFilteredProducts(products); // Show all products if filter is empty
        return;
      }
      try {
        const response = await ProductService.filterProduct(parseInt(selectedFilterValue1,10), parseInt(selectedFilterValue2,10));
        console.log(response);
        if (response && response.status === "success") {
          // Access the products array from the response
          setProducts(response.data.products || []);
          setFilteredProducts(response.data.products || []); // Optionally set filteredProducts here
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    filterProducts();
  }, [selectedFilterValue1,selectedFilterValue2]);

 

  

 // Handle input change for search
 const handleChangeSearch = (event) => {
  setSearchTerm(event.target.value); // Update search term
  console.log(searchTerm);
};

// Search products by name when searchTerm changes
useEffect(() => {
  const searchProducts = async () => {
    console.log(searchTerm);
    if (searchTerm === "") {
      console.log("Search term empty, showing all products");
      setFilteredProducts(products); // Show all products if search is empty
      return;
    }

    // Fetch filtered products by search term
    try {
      //const name=searchTerm.trim();
      const response = await ProductService.searchProduct(searchTerm);
      console.log("Search Term:", searchTerm);
      if (response && response.status === "success") {
        setFilteredProducts(response.data.products || []);
      }
    } catch (error) {
      console.error("Failed to search products", error);
    }
  };

  searchProducts();
   }, [searchTerm]); // Dependency includes products and searchTerm

  return (
    <div>
      <div className="search-filter-sort">
        <div>
          <form className="flex flex-col md:flex-row gap-3" 
           onSubmit={handleChangeSearch}
          >
            <div className="flex">
              <input
                type="text"
                placeholder="Search for the tool you like"
                className="w-full md:w-80 px-3 h-10 rounded-l border-2 border-sky-500 focus:outline-none focus:border-sky-500"
                name="searchTerm"
                value={searchTerm}
                onChange={handleChangeSearch}
                
              />
              <button 
                 type="submit" 
                className="bg-sky-500 text-white rounded-r px-2 md:px-3 py-0 md:py-1"
                >
                Search
              </button>
            </div>


            <select
              id="pricingType"
              name="selectedFilterValue1"
              value={selectedFilterValue1}
              onChange={handleChangeFilter1}
              className="w-40 h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
            >
              <option value="Filter min price">Filter min price</option>
              <option value="100" >10</option>
              <option value="500">50</option>
              <option value="100" >100</option>
            </select>

            <select
              id="pricingType"
              name="selectedFilterValue2"
              value={selectedFilterValue2}
              onChange={handleChangeFilter2}
              className="w-40 h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
            >
              <option value="Filter max price" >Filter max price</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>


            <select
              id="ratingType"
              name="selectedSort"
               value={selectedSort}
               onChange={handleChangeSort}
              className="w-40 h-10 border-2 border-sky-500 focus:outline-none focus:border-sky-500 text-sky-500 rounded px-2 md:px-3 py-0 md:py-1 tracking-wider"
            >
              <option value="Sort by rating" 
              onChange={handleChangeSort}>Sort by rating</option>
              <option value="asc" 
              onChange={handleChangeSort}>asc</option>
              <option value="desc" 
              onChange={handleChangeSort}>desc</option>
            </select>
          </form>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        <ul className="list">
          {filteredProducts.map((product, idx) => (
            <ProductCard key={idx} products={products} />
          ))}
        </ul>
      )}
    </div>
  );
}
