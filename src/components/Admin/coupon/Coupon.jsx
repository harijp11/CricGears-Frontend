
import React, { useEffect, useState } from "react";
import {
  Trash2,
  Tag,
  IndianRupee,
  Calendar,
  Users,
  Layers,
  FolderX,
  Ticket,
  Edit2,
  Search,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { useNavigate } from "react-router-dom";
import { deleteCouponApi, FetchCouponsApi } from "../../../services/coupon";
import ConfirmationModal from "../../shared/confirmationModal";
import { toast } from "sonner";
import { useDebounce } from "../../shared/useBounce"; // Added for debounced search
import Pagination from "../../shared/Pagination"; // Added for pagination

export default function CouponList() {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [relaod, setreload] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });
  const [page, setPage] = useState(1); // Added for pagination
  const [totalPages, setTotalPages] = useState(0); // Added for pagination
  const limit = 10; // Added for pagination
  const [searchQuery, setSearchQuery] = useState(""); // Added for search
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Added for debounced search

  const handleAddCoupon = () => {
    navigate("/admin/addcoupon");
  };

  const handleEditCoupon = (couponId) => {
    navigate(`/admin/editcoupon/${couponId}`);
  };

  const handleRemoveCoupon = (id) => {
    setModalContent({
      title: " Remove Coupon",
      message: `Are you sure you want to remove this coupon?`,
      onConfirm: async () => {
        try {
          const response = await deleteCouponApi(id);
          console.log("called");
          setreload(true);
          return toast.success(response.data.message);
        } catch (err) {
          if (err.response) {
            toast.error(err.response.data.message);
          }
          console.log(err);
        }
      },
    });
    setIsOpen(true);
  };

  async function fetchCoupons() {
    try {
      const response = await FetchCouponsApi({ page, limit, search: debouncedSearchQuery });
      setCoupons(response.data.Coupons);
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
    } catch (err) {
      console.log("error", err);
    }
  }

  useEffect(() => {
    fetchCoupons();
    setreload(false);
  }, [relaod, page, debouncedSearchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <header>
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">Coupons</h1>
            </div>
            <div className="container mx-auto px-4 mb-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/admin/home"
                      className="text-gray-600 hover:text-black"
                    >
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-gray-400" />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/admin/Dashboard"
                      className="text-gray-600 hover:text-black"
                    >
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-gray-400" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-gray-900">
                      coupons
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search coupons..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <button
              onClick={handleAddCoupon}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 shadow-md flex items-center"
            >
              <Ticket className="mr-2" size={18} />
              Add Coupon
            </button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {coupons.length != 0 &&
            coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="rounded-lg shadow-md p-6 relative hover:shadow-lg transition duration-300 border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {coupon.code}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {coupon.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                    <button
                      onClick={() => handleEditCoupon(coupon._id)}
                      className="text-blue-500 hover:text-blue-700 transition duration-300"
                      aria-label="Edit coupon"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleRemoveCoupon(coupon._id)}
                      className="text-red-500 hover:text-red-700 transition duration-300"
                      aria-label="Remove coupon"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Tag className="mr-2 text-blue-500" size={16} />
                    <span className="font-medium">Discount:</span>
                    <span className="ml-1">{coupon.discountValue}%</span>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="mr-2 text-green-500" size={16} />
                    <span className="font-medium">Min Purchase:</span>
                    <span className="ml-1">₹{coupon.minPurchaseAmount}</span>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="mr-2 text-yellow-500" size={16} />
                    <span className="font-medium">Max Discount:</span>
                    <span className="ml-1">
                      ₹{coupon.maxDiscountAmount || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 text-purple-500" size={16} />
                    <span className="font-medium">Expires:</span>
                    <span className="ml-1">
                      {new Date(coupon.expirationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 text-indigo-500" size={16} />
                    <span className="font-medium">Usage Limit:</span>
                    <span className="ml-1">
                      {coupon.usageLimit || "Unlimited"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {coupons.length == 0 && (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center">
              <FolderX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h1 className="text-2xl font-semibold text-gray-900">
                No Coupons added yet
              </h1>
            </div>
          </div>
        )}
        {coupons.length != 0 && (
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        )}
      </div>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
      />
    </div>
  );
}
