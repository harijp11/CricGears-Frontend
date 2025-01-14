import React, { useState } from "react";
import { Tag, Calendar, Users, Save,ArrowLeft } from "lucide-react";
import { AddCouponApi } from "../../../APIs/coupon";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { validateCouponForm } from "../../../util/couponValidation";

function AddCoupon() {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [discountValue, setDiscountValue] = useState("");
    const [minPurchaseAmount, setMinPurchaseAmount] = useState("");
    const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [usageLimit, setUsageLimit] = useState("");
    const [error, setError] = useState({});

    const handleSubmit = async (e)=>{
        e.preventDefault()

        const validationErrors = validateCouponForm({
          code,
          description,
          discountValue,
          minPurchaseAmount,
          maxDiscountAmount,
          expirationDate,
          usageLimit
      });
      
      if (Object.keys(validationErrors).length > 0) {
          setError(validationErrors);
          return;
      }

       try{
          const coupon ={
            code,
          description,
          discount_value: parseFloat(discountValue),
          min_purchase_amount: parseFloat(minPurchaseAmount),
          max_discount_amount: parseFloat(maxDiscountAmount),
          expiration_date: new Date(expirationDate),
          usage_limit: parseInt(usageLimit),
          is_active: true,
          }

          const response = await AddCouponApi(coupon)
          toast.success(response.data.message);
          navigate("/admin/viewcoupons");
       }catch(err){
        console.log(err)
        if (err.response) {
            toast.error(err.response.data.message);
       }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
       <div class="fixed left-3 top-3">
          <button
            onClick={() => window.history.back()}
            className="absolute left-0 top-0 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          </div>
      <div className="w-full max-w-2xl">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <h1 className="text-3xl font-bold text-white tracking-wide">
              Create Coupon
            </h1>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Coupon Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="code"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="SUMMER2023"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                {error.code && (
                    <span className="text-red-500 text-xs mt-1">{error.code}</span>
                  )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <input
                  id="description"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  placeholder="Enter coupon description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                  {error.description && (
                  <span className="text-red-500 text-xs mt-1">
                    {error.description}
                  </span>
                )}
              </div>
              <div>
                <label
                  htmlFor="discount_value"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Discount Value (%)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">%</span>
                  </div>
                  <input
                    type="number"
                    id="discount_value"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="20"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    required
                  />
                </div>
                {error.discountValue && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.discountValue}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="min_purchase_amount"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Minimum Purchase Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="min_purchase_amount"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="100"
                    value={minPurchaseAmount}
                    onChange={(e) => setMinPurchaseAmount(e.target.value)}
                  />
                  {error.minPurchaseAmount && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.minPurchaseAmount}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="max_discount_amount"
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
                    id="max_discount_amount"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="50"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                  />
                  {error.maxDiscountAmount && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.maxDiscountAmount}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="expiration_date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Expiration Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="expiration_date"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                  />
                </div>
                {error.expirationDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.expirationDate}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="usage_limit"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Usage Limit
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="usage_limit"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    placeholder="100"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                  />
                  {error.usageLimit && (
                    <p className="text-red-500 text-xs mt-1">
                      {error.usageLimit}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
              >
                <Save className="h-5 w-5 mr-2" />
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddCoupon;


