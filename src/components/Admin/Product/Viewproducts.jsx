import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import axiosInstance from "../../../AxiosInstance";
import Pagination from "../../shared/Pagination";
import { Button } from "../../ui/button";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import { fetchProdOfferApi } from "../../../APIs/OffersApi";
import { FolderX, PlusCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [reload, setReload] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10;

  async function fetchProducts() {
    try {
      const response = await axiosInstance.get(`/admin/fetchProducts?page=${page}&limit=${limit}`);
      setTotalPages(response.data.totalPages);
      setPage(response.data?.currentPage);
      const res = await axiosInstance.get("/admin/sendCategory");
      setCategories(res.data.categories);
      setProducts(response.data.products);
      if (reload) setReload(false);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return toast.error(err.response.data.message);
      }
    }
  }

  async function fetchProdOffer() {
    try {
      const response = await fetchProdOfferApi();
      setOffers(response.data.productoffer);
    } catch (err) {
      console.log("error");
    }
  }

  useEffect(() => {
    fetchProdOffer();
    fetchProducts();
  }, [page, reload]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">View Products</h1>
        <Button onClick={() => navigate("/admin/addproduct")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      <div className="text-sm breadcrumbs mb-6">
        <button className="text-gray-500" onClick={() => navigate("/admin/home")}>
          Home &gt;
        </button>
        <button className="text-gray-500" onClick={() => navigate("/admin/Dashboard")}>
          Dashboard &gt;
        </button>
        <button className="text-gray-500" onClick={() => navigate("/admin/viewproducts")}>
          View Products
        </button>
      </div>
      {products.length > 0 ? (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                <TableHead className="w-1/4">Product</TableHead>
                  <TableHead className="w-24">Price</TableHead>
                  <TableHead className="w-1/4">Description</TableHead>
                  <TableHead className="w-1/6">Product Offer</TableHead>
                  <TableHead className="w-1/6">Status</TableHead>
                  <TableHead className="w-24 text-right pr-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    offers={offers}
                    categories={categories}
                    setReload={setReload}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4">
            <Pagination page={page} setPage={setPage} totalPages={totalPages} />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <FolderX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900">No Products added yet</h1>
          </div>
        </div>
      )}
    </div>
  );
}

