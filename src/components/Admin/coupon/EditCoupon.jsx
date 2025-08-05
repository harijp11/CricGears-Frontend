import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Save, Tag, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { editCoupon, fetchCouponById } from "../../../services/coupon"; // Assuming APIs are in this file
import { validateCouponForm } from "../../../util/couponValidation"; // Import the validation function

export default function UpdateCoupon() {
  const navigate = useNavigate();
  const { couponId } = useParams(); // Get coupon ID from URL params
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountValue: "",
    minPurchaseAmount: "",
    maxDiscountAmount: "",
    expirationDate: "",
    usageLimit: "",
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch coupon data when component mounts
  useEffect(() => {
    async function loadCoupon() {
      try {
        const response = await fetchCouponById(couponId);
        const coupon = response.data.coupon; // Adjust based on API response structure
        setFormData({
          code: coupon.code || "",
          description: coupon.description || "",
          discountValue: coupon.discountValue || "",
          minPurchaseAmount: coupon.minPurchaseAmount || "",
          maxDiscountAmount: coupon.maxDiscountAmount || "",
          expirationDate: coupon.expirationDate
            ? new Date(coupon.expirationDate).toISOString().split("T")[0]
            : "",
          usageLimit: coupon.usageLimit || "",
        });
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load coupon data");
        console.error(err);
        setLoading(false);
      }
    }
    loadCoupon();
  }, [couponId]);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    
    // Clear specific field error when user starts typing
    if (error[id]) {
      setError((prev) => ({ ...prev, [id]: "" }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use the enhanced validation function
    const validationResult = validateCouponForm(formData);
    
    console.log("Validation result:", validationResult); // Debug log
    console.log("Form data:", formData); // Debug log
    
    if (!validationResult.isValid) {
      setError(validationResult.errors);
      console.log("Setting errors:", validationResult.errors); // Debug log
      toast.error("Please fix the validation errors");
      return;
    }

    try {
      const couponData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minPurchaseAmount: parseFloat(formData.minPurchaseAmount) || null,
        maxDiscountAmount: parseFloat(formData.maxDiscountAmount) || null,
        usageLimit: parseInt(formData.usageLimit) || null,
      };
      const response = await editCoupon({ ...couponData, _id: couponId });
      toast.success(response.data.message || "Coupon updated successfully");
      navigate("/admin/viewcoupons");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update coupon");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="fixed left-3 top-3">
        <button
          onClick={() => navigate("/admin/viewcoupons")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>
      <div className="w-full max-w-2xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Update Coupon
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="code"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                      error.code ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="SUMMER2023"
                    value={formData.code}
                    onChange={handleChange}
                  />
                </div>
                {error.code && (
                  <p className="text-red-500 text-sm mt-1 block">{error.code}</p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  id="description"
                  className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                    error.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter coupon description"
                  value={formData.description}
                  onChange={handleChange}
                />
                {error.description && (
                  <p className="text-red-500 text-sm mt-1 block">
                    {error.description}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="discountValue"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Discount Value (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">%</span>
                  </div>
                  <input
                    type="number"
                    id="discountValue"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                      error.discountValue ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="20"
                    min="0"
                    max="90"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={handleChange}
                  />
                </div>
                {error.discountValue && (
                  <p className="text-red-500 text-sm mt-1 block">
                    {error.discountValue}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="minPurchaseAmount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Minimum Purchase Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="minPurchaseAmount"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                      error.minPurchaseAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="500"
                    min="500"
                    max="10000"
                    value={formData.minPurchaseAmount}
                    onChange={handleChange}
                  />
                </div>
                {error.minPurchaseAmount && (
                  <p className="text-red-500 text-sm mt-1 block">
                    {error.minPurchaseAmount}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="maxDiscountAmount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Maximum Discount Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="maxDiscountAmount"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                      error.maxDiscountAmount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="50"
                    min="0"
                    max="10000"
                    value={formData.maxDiscountAmount}
                    onChange={handleChange}
                  />
                </div>
                {error.maxDiscountAmount && (
                  <p className="text-red-500 text-sm mt-1 block">
                    {error.maxDiscountAmount}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="expirationDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Expiration Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="expirationDate"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                      error.expirationDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    value={formData.expirationDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {error.expirationDate && (
                  <p className="text-red-500 text-sm mt-1 block">
                    {error.expirationDate}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="usageLimit"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Usage Limit <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="usageLimit"
                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ${
                      error.usageLimit ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="100"
                    min="1"
                    max="10000"
                    value={formData.usageLimit}
                    onChange={handleChange}
                  />
                </div>
                {error.usageLimit && (
                  <p className="text-red-500 text-sm mt-1 block">
                    {error.usageLimit}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
              >
                <Save className="h-5 w-5 mr-2" />
                Update Coupon
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}