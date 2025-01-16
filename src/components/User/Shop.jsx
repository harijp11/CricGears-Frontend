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

const ProductSkeleton = () => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <div className="animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-md mb-4" />
      <div className="w-3/4 h-4 bg-gray-200 mb-2 rounded" />
      <div className="w-1/2 h-4 bg-gray-200 mb-4 rounded" />
      <div className="flex justify-between items-center">
        <div className="w-1/3 h-6 bg-gray-200 rounded" />
        <div className="w-16 h-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  </div>
);

const LoadingGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(8)].map((_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
);

const ShopNow = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    size: [],
  });
  const [search, setsearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 200);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

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
        toast.error("No products found");
      } else if (err.response?.status === 400) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Error fetching products");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedFilters, sortBy]);

  useEffect(() => {
    fetchNewArrivals();
    console.log(search);
  }, [debouncedSearch, page, selectedFilters, search, sortBy]);

  return (
    <div className="container md:mx-auto md:px-4 md:py-8">
      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.6;
          }
        }
        .animate-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
      `}</style>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Responsive Sidebar */}
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
        <div className="flex-grow md:pl-8 md:pr-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Products</h1>
            <div className="flex gap-5">
              <SearchComponent setsearch={setsearch} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Sort by: {sortBy} <ChevronDown className="ml-2 h-4 w-4" />
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
                    Name: aA - zZ
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name-z-to-a")}>
                    Name: zZ - aA
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("")}>
                    No Sort
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Product Grid with Loading State */}
          {isLoading ? (
            <LoadingGrid />
          ) : (
            <ProductCardContainer products={products} />
          )}
        </div>
      </div>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default ShopNow;