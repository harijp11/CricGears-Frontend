import React, { useEffect, useState } from "react";
import { Star, ChevronDown, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { useDebounce } from "use-debounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import FilterSidebar from "./FilterdSidebar";
import ProductCardContainer from "../ui/ProductContainer";
import SearchComponent from "../ui/Searchcomponent";
import { toast } from "sonner";
import axiosInstance from "../../AxiosInstance";
import Pagination from "../shared/Pagination";

const ShopNow = () => {
  // Filter states
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    size: [],
  });

  // Search and pagination states
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Constants
  const limit = 10;

  // Fetch products function
  async function fetchNewArrivals() {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/user/fetchProducts", {
        params: {
          page,
          limit,
          category: selectedFilters.category.join(","),
          size: selectedFilters.size.join(","),
          search: debouncedSearch,
          sortBy,
        },
      });

      if (response.data.success) {
        setTotalPages(response.data.totalPages);
        setProducts(response.data.productData);
      } else {
        setProducts([]);
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);

      if (err.response?.status === 404) {
        toast.error("No products found for your search criteria");
      } else if (err.response?.status === 400) {
        toast.error(err.response.data.message || "Invalid request");
      } else {
        toast.error("Failed to load products. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedFilters, sortBy]);

  // Fetch products when dependencies change
  useEffect(() => {
    fetchNewArrivals();
  }, [debouncedSearch, page, selectedFilters, sortBy]);

  // Reset filters function
  const handleResetFilters = () => {
    setSelectedFilters({ category: [], size: [] });
    setSortBy("");
    setSearch("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden mb-4">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <FilterSidebar
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              className="mt-4"
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <FilterSidebar
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          className="hidden lg:block w-64 flex-shrink-0"
        />

        {/* Main Content */}
        <div className="flex-grow">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Products</h1>
            <div className="flex gap-5">
              <SearchComponent setsearch={setSearch} search ={search} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort by: {sortBy || "Default"} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>
                    Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-low-to-high")}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("price-high-to-low")}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-a-to-z")}>
                    Name: A to Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-z-to-a")}>
                    Name: Z to A
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("")}>
                    No Sort
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg">
              <div className="text-center p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-600 mb-4">
                  {debouncedSearch
                    ? "Try adjusting your search or filters"
                    : "No products available at the moment"}
                </p>
                {(selectedFilters.category.length > 0 ||
                  selectedFilters.size.length > 0 ||
                  debouncedSearch ||
                  sortBy) && (
                  <Button variant="outline" onClick={handleResetFilters}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            // Product Grid
            <ProductCardContainer products={products} />
          )}
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && products.length > 0 && (
        <div className="mt-8">
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
};

export default ShopNow;