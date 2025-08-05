
import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { PlusCircle, Pencil, MoreVertical, FolderX, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import Pagination from "../../shared/Pagination";
import { fetchCatApi, removeOffer } from "../../../services/OffersApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { fetchPaginatedCategoriesAPI, toggleCategoryStatusAPI } from "../../../services/categoryService";
import { useDebounce } from "../../shared/useBounce";

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [offer, setOffer] = useState([]);
  const [catId, setCatId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Added for search
  const limit = 5;
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await fetchPaginatedCategoriesAPI({ page, limit, search: debouncedSearchQuery });
      setTotalPages(response.data.totalPages);
      setCategories(response.data.categories);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return toast.error(err.response.data.message);
      }
    }
  };

  
  function handleEdit(id) {
    navigate(`/admin/editcategory/${id}`);
  }

  async function handleToggle(_id, isActive) {
    try {
      setToggle(!toggle);
      const response = await toggleCategoryStatusAPI({ _id, isActive });
      if (response.data.success) {
        const updatedStatus = response.data.updatedCategory?.isActive ?? !isActive;

        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === _id ? { ...cat, isActive: updatedStatus } : cat
          )
        );
      }
      toast.success(response.data.message);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        return toast.error(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.");
    }
  }

  async function fetchCatOffer() {
    try {
      const response = await fetchCatApi();
      setOffer(response.data.categoryoffer);
    } catch (err) {
      console.log(err);
    }
  }

  async function removeCategoryOffer(_id, categoryid) {
    try {
      const response = await removeOffer(_id, categoryid);
      toast.success(response.data.message);
      setReload(true);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  }

  useEffect(() => {
    fetchData();
    fetchCatOffer();
    setReload(false);
  }, [page, reload, debouncedSearchQuery]);

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold">view Categories</h1>
            <div>
              <button
                className="text-gray-500"
                onClick={() => navigate("/admin/home")}
              >
                Home &gt;
              </button>
              <button
                className="text-gray-500"
                onClick={() => navigate("/admin/Dashboard")}
              >
                Dashboard &gt;
              </button>
              <button
                className="text-gray-500"
                onClick={() => navigate("/admin/viewcategory")}
              >
                View Categories
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search categories..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <Button
              onClick={() => navigate("/admin/addCategory")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Create Category
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {categories.length != 0 && (
            <Table className="w-full bg-white shadow-md rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Category Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Added</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead>Offer</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => {
                  const categoryOffer = offer.find(
                    (f) => f.targetId === category._id
                  );
                  return (
                    <TableRow key={category._id}>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-medium">
                        {category.createdAt}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-medium">
                        {category.isActive ? "Enabled" : "Disabled"}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>
                            {categoryOffer
                              ? `OfferName: ${categoryOffer.name}`
                              : ""}
                          </span>
                          <span>
                            {categoryOffer
                              ? `Offer Percentage: ${categoryOffer.offerValue}%`
                              : "0%"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center space-x-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEdit(category._id)}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleToggle(category._id, category.isActive)
                                }
                              >
                                {category.isActive == true
                                  ? "Disable"
                                  : "Enable"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  if (categoryOffer) {
                                    removeCategoryOffer(categoryOffer._id, category._id);
                                  } else {
                                    navigate(
                                      `/admin/addcategoryoffer/${category._id}/${category.name}`
                                    );
                                  }
                                }}
                              >
                                {categoryOffer ? "Remove Offer" : "Add Offer"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {categories.length == 0 && (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="text-center">
                <FolderX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h1 className="text-2xl font-semibold text-gray-900">
                  No categories added yet
                </h1>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4">
          <br />
          <br />
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
