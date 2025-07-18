import axiosInstance from "../../../AxiosInstance";
// import store from "@/store/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "../../ui/button";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { getOrderDetailsByIdAPI } from "../../../services/orderService";

export default function ViewOrderDetailsAdmin() {
  const adminData = useSelector((store) => store.admin.adminDatas);

  const { id } = useParams();

  const [orderData, setorderData] = useState(null);

  async function fetchOrderDetails() {
    try {
      const response = await getOrderDetailsByIdAPI(id);
      setorderData(response?.data?.order || {});
    } catch (err) {
      console.log(err);
    }
  }
  // console.log();
  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
       <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h1>
          <div className="container mx-auto px-0 py-0 mb-4">
              <Breadcrumb>
                <BreadcrumbList>
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
                    <BreadcrumbLink
                      href="/admin/vieworders"
                      className="text-gray-600 hover:text-black"
                    >
                     View Orders
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-gray-400" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-gray-900">
                    {orderData?.orderId}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
       </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6 md:p-8 flex justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Order #{orderData?.orderId || "N/A"}
            </h2>
            <p className="text-base text-gray-600 mt-2">
              Placed on:{" "}
              {orderData?.placedAt
                ? new Date(orderData.placedAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          {/* <Button
          //    onClick={handleDownloadInvoice}
          >
            Download Invoice
          </Button> */}
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Shipping Address</h3>
                <p className="text-lg">
                  {orderData?.shippingAddress?.name || "N/A"}
                </p>
                <p>{orderData?.shippingAddress?.address || "N/A"}</p>
                <p>
                  {orderData?.shippingAddress?.city || "N/A"},{" "}
                  {orderData?.shippingAddress?.district || "N/A"}
                </p>
                <p>
                  {orderData?.shippingAddress?.state || "N/A"} -{" "}
                  {orderData?.shippingAddress?.pincode || "N/A"}
                </p>
                <p>Landmark: {orderData?.shippingAddress?.landmark || "N/A"}</p>
                <p>Phone: {orderData?.shippingAddress?.phone || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">
                  Payment Information
                </h3>
                <p>Method: {orderData?.paymentMethod || "N/A"}</p>
              </div>
              {orderData?.orderStatus != "Cancelled" && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">
                    Delivery Information
                  </h3>
                  <p>
                    Expected Delivery:{" "}
                    {orderData?.deliveryBy
                      ? new Date(orderData.deliveryBy).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-lg">
                <div className="flex justify-between">
                  <span>Items Total:</span>
                  <span>₹{(orderData?.totalAmount+(orderData?.totalDiscount-orderData?.couponDiscount)).toFixed(2) || "0.00"}</span>
                </div>
                <div className='flex justify-between'>
                      <span>Discount:</span>
                      <span>
                        -₹{(orderData?.totalDiscount-orderData?.couponDiscount).toFixed(2) || "0.00"}
                      </span>
                    </div>
                <div className="flex justify-between">
                      <span>Coupon Discount:</span>
                      <span>
                        -₹{orderData?.couponDiscount?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span>
                    {orderData?.shippingFee > 0
                      ? orderData?.shippingFee?.toFixed(2)
                      : "Free"}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-xl pt-4 border-t">
                  <span>Total:</span>
                  <span>₹{orderData?.total_price_with_discount?.toFixed(2) || "0.00"}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Order Items</h3>
            <div className="space-y-6">
              {orderData?.orderItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-6 py-6 border-b last:border-b-0"
                >
                  <img
                    src={item?.product?.images?.[0] || ""}
                    alt={item?.product?.name || "Product Image"}
                    className="w-32 h-52 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <h4 className="text-lg font-medium">
                      {item?.product?.name || "N/A"}
                    </h4>
                    <p className="text-base text-gray-600">
                      Quantity: {item?.qty || "0"}
                    </p>
                    <p className="text-base text-gray-600">
                      Price: ₹{item?.price?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-base text-gray-600">
                      Order Status: {item?.orderStatus || "N/A"}
                    </p>

                  { item?.orderStatus === "Cancelled" ? <p className="text-base text-gray-600">
                      Cancel Reason: {item?.cancelReason || "N/A"}
                    </p>: null}

                    <p className="text-base text-gray-600">
                      Payment Status: {item?.paymentStatus || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium">Price:</p>
                    <p className="text-base text-gray-600">
                      ₹{item?.totalPrice?.toFixed(2) || "0.00"}
                    </p>

                    <span className="text-green-800 font-semibold text-sm sm:text-base">
                      Delivered on:{" "}
                      {item?.orderStatus === "Delivered"
                        ? new Date(item?.deliveredOn).toLocaleString("en-GB", {
                            weekday: "long", 
                            day: "2-digit", 
                            month: "long", 
                            year: "numeric", 
                            hour: "2-digit",
                            minute: "2-digit", 
                            second: "2-digit", 
                            hour12: true,
                          })
                        : <sapn className="text-yellow-400"> proccessing...</sapn> }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
