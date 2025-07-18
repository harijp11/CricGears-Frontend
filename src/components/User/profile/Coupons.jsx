import React, { useEffect, useState } from "react";
import { Tag, IndianRupee, Calendar, Users, Copy,Ticket } from "lucide-react";
import { FetchCouponsApi } from "../../../services/coupon";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
export default function userCouponList(){
    const userData = useSelector((store) => store.user.userDatas);
  const [coupons, setCoupons] = useState([]);
  let   [couponUsed,setCouponUsed]=useState()

  async function fetchAllCoupons(){
    try {
      const response = await FetchCouponsApi();
      const coupons = response.data.Coupons
      // console.log("coupons details",response.data.Coupons)
      // console.log(response.data.Coupons.map((coupon)=>coupon.usersApplied))
       const fetchCoupons = coupons.map((coupon)=>{
        let userCount = 0;
         if(Array.isArray(coupon.usersApplied)){
            const userApplied = coupon.usersApplied.find(
                (userApplied)=>userApplied.user == userData._id
            )
              userCount = userApplied ? userApplied.used_count : 0
         }
         return {...coupon,userCount}
      })
      setCoupons(fetchCoupons);
    }catch(err){
        console.error(err);
        toast.error("Failed to fetch coupons");
    }
  }


  useEffect(() => {
    fetchAllCoupons();
  //  console.log("----",couponUsed)
  }, []);

  const handleCopyCode=(code)=>{
    navigator.clipboard
     .writeText(code)
     .then(()=>{
        toast.success("Coupon code copied to clipboard");
     })
     .catch((err)=>{
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy coupon code");
     })
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto lg:max-w-5xl xl:max-w-6xl">
      <header>
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">Available Coupons</h1>
      </div>
      <div className="container mx-auto px-4 mb-4">
      <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-gray-600 hover:text-black">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/viewprofile" className="text-gray-600 hover:text-black">{userData.name}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">Coupons</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
    {coupons.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2"><Ticket/>No Coupons Available</h2>
          <p className="text-gray-500">Check back later for new discount offers!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {coupons.map((coupon) => (
            // Your existing coupon card code
            <div
              key={coupon._id}
              className={`bg-white ${
                coupon.usageLimit == couponUsed ? "opacity-40" : ""
              } rounded-lg shadow-md p-6 relative hover:shadow-lg transition duration-300 border border-gray-200`}
            >
              {/* Rest of your existing coupon card JSX */}
              <div className="flex flex-col h-full">
                {couponUsed == coupon.usageLimit && (
                  <h1 className="text-red-800 font-bold  lg:text-5xl self-center absolute top-1/2">
                    USAGE LIMIT EXCEEDED
                  </h1>
                )}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {coupon.code}
                    </h2>
                    {couponUsed != coupon.usageLimit && (
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="text-blue-500 hover:text-blue-700 transition duration-300"
                        aria-label="Copy coupon code"
                      >
                        <Copy size={18} />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {coupon.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm flex-grow">
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
                    <span className="font-medium">Coupon Used:</span>
                    <span className="ml-1">{coupon.userCount || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 text-indigo-500" size={16} />
                    <span className="font-medium">Usage Limit:</span>
                    <span className="ml-1">{coupon.usageLimit}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}