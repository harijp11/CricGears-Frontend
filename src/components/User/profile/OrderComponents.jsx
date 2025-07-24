import { stubFalse } from "lodash";
import axiosInstance from "../../../AxiosInstance";
import ConfirmationModal from "../../shared/confirmationModal";
import Pagination from "../../shared/Pagination";
import ReturnConfirmation from "../../shared/ReturnConfirmation";
import ContinuePayment from "../../../util/ContinuePayment";
import { Package } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { cancelOrderItemAPI, finishPaymentAPI, getUserOrdersAPI, requestReturnAPI } from "../../../services/orderService";

export default function OrdersComponent() {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user.userDatas);
  const [orders, setorders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [reload, setreload] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [cancelReason, setCancelReason] = useState("");
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    content: "",
  });
  const [orderId, setOrderId] = useState(null);
  const [itemId, setItemId] = useState(null);
  //refund states
  const [isOpenReturn, setIsOpenReturn] = useState(false);

  //pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 2;

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  async function fetchOrders() {
    try {
      const response = await getUserOrdersAPI(userData._id, page, limit);
      console.log("response data",response)
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
      setorders(response.data.orders); 
    } catch (err) {
      if (err.response) {
        console.log(err);
        toast.error(err.response.data.message);
      }
      console.log(err);
    }
  }

  //cancel FUnctions
  const onConfirm = async () => {
    if (!cancelReason.trim()) {
      toast.warning("Please select a cancellation reason");
      return;
    }
    try {
      const response = await cancelOrderItemAPI(orderId, itemId, reason);
      setIsOpen(false);
      setCancelReason("");
      setreload(true);
      return toast.success(response.data.message);
    } catch (err) {
      if (err.response) {
        console.log(err);
        toast.error(err.response.data.message);
      }
      console.log(err);
    }
  };

  const handleCancel = () => {
    setModalContent({
      title: "Cancel Order",
      message: (
        <div className="space-y-4">
          <p>Are you sure you want to cancel this order?</p>
          <div>
            <label
              htmlFor="cancelReason"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Please provide a reason for cancellation:
            </label>
            <input
              type="text"
              id="cancelReason"
              onChange={(e) => setCancelReason(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
              focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              placeholder="Enter your reason"
              required
            />
          </div>
        </div>
      ),
    });
    setIsOpen(true);
  };

  const handleReturnReq= async (orderId,itemId)=>{
    setModalContent({
      title: "Return Order",
      message: "Are you sure you want to return this order?",
      onConfirm: async (reason, explanation) => {
        try {
         
          //register return req
          const response = await requestReturnAPI({
      reason,
      explanation,
      orderId,
      itemId,
    });
          toast.success(response.data.message);
          setreload(true);
          setIsOpenReturn(false);
        } catch (err) {
          console.error(err);
          if (err.response) {
            toast.error(err.response.data.message);
          }
        }
      },
    });
    setIsOpenReturn(true);
  }

  async function handleContinuePayment(orderId){
      try{
        const response = await finishPaymentAPI(orderId);
        toast.success(response.data.message);
        setreload(true);
      }catch(err){
        console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
      }
  }

  useEffect(() => {
    fetchOrders();
    setreload(stubFalse);
  }, [reload, page]);

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {orders.length === 0 ? (
          <div className="flex flex-col mt-32 items-center justify-center space-y-4 py-16">
            <Package size={64} className="text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-700">
              You have no orders yet
            </h2>
            <p className="text-gray-500">
              Looks like you haven't placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-4 bg-black text-white py-2 px-4 rounded-md hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">My Orders</h1>

            <div className="container mx-auto px-0 mb-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/"
                      className="text-gray-600 hover:text-black"
                    >
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-gray-400" />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/viewprofile"
                      className="text-gray-600 hover:text-black"
                    >
                      {userData.name}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-gray-400" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-gray-900">
                      My Orders
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 p-3 sm:p-4 lg:p-6 bg-gray-50 border-b border-gray-200 text-xs sm:text-sm">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                      <div className="text-gray-500">Order Placed</div>
                      <div className="font-medium">
                        {new Date(order.placedAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                      <div className="text-gray-500">
                        Expected Delivery Date
                      </div>
                      <div className="font-medium">
                        {new Date(order.deliveryBy).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-1">
                      <div className="text-gray-500">Products</div>
                      <div className="font-medium">
                        {order.orderItems.length}
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                      <div className="text-gray-500">Ship To</div>
                      <div className="font-medium">
                        {order.shippingAddress.name}
                      </div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                      <div className="text-gray-500">Order #</div>
                      <div className="font-medium">{order.orderId}</div>
                    </div>

                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-1">
                      {order.orderItems.some(
                        (item) =>
                          item.paymentStatus === "Failed" &&
                          item.orderStatus !== "Cancelled"
                      ) ? (
                        <div className="mt-2 sm:mt-0">
                          <ContinuePayment
                          total={order.total_price_with_discount.toFixed(2)}
                          onSuccess={() => handleContinuePayment(order._id)}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="font-medium">
                            <div className="text-gray-500">Amount</div>
                            <div>₹{order.totalAmount.toFixed(2)}</div>
                          </div>
                          <div className="font-medium">
                            <div className="text-gray-500">Coupon Discount</div>
                            <div>
                              ₹{(order.totalAmount.toFixed(2)-order.total_price_with_discount.toFixed(2)).toFixed(2)}
                            </div>
                          </div>
                          <div className="font-medium">
                            <div className="text-gray-500">Total</div>
                            <div>
                              ₹{order.total_price_with_discount.toFixed(2)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 lg:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div className="text-base sm:text-lg font-semibold mb-2 sm:mb-0">
                        Order Summary
                      </div>
                    </div>

                    <div className="space-y-4">
                      {order.orderItems
                        .slice(
                          0,
                          expandedOrders.includes(order._id) ? undefined : 2
                        )
                        .map((items) => (
                          <div
                            key={items.product._id}
                            className="flex flex-col sm:flex-row items-start gap-4 py-4 border-t border-gray-100 first:border-t-0"
                          >
                            <div className="w-full sm:w-24 aspect-[4/3] sm:h-40 flex-shrink-0">
                              <img
                                src={items?.product?.images[0]}
                                alt={items?.product?.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            </div>

                            <div className="flex-grow">
                              {/* {items?.DeliveredOn && (
                                <span className="text-green-800 font-semibold text-xs sm:text-sm">
                                  Delivered on:{" "}
                                  {new Date(
                                    items?.DeliveredOn
                                  ).toLocaleDateString()}
                                </span>
                              )} */}
                              <h3 className="text-base sm:text-lg font-medium mt-2">
                                {items.product.name}
                              </h3>
                              <p className="font-semibold text-sm text-gray-500">
                                Order Status:{" "}
                                <span
                                  className={`font-medium text-xs sm:text-sm ${
                                    items.order_status === "Pending"
                                      ? "text-yellow-500"
                                      : items.orderStatus === "Shipped"
                                      ? "text-blue-500"
                                      : items.orderStatus === "Delivered"
                                      ? "text-green-500"
                                      : items.orderStatus === "Cancelled"
                                      ? "text-red-500"
                                      : ""
                                  }`}
                                >
                                  {items.orderStatus}
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                Price: ₹{items.totalPrice.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-500">
                                Size: {items.size}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {items.qty}
                              </p>
                            </div>
                            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 w-full sm:w-auto">
                              {items.orderStatus !== "Delivered" &&
                                items.orderStatus !== "Cancelled" &&
                                items.orderStatus !== "Returned" &&
                                items.orderStatus !== "Return Rejected" && (
                                  !items?.returnReq?.request_status &&
                                  <span className="text-orange-500 text-xs sm:text-sm mb-2">
                                    {/* Return deadline:{" "} */}
                                    {Math.ceil(
                                      (new Date(items.deliveredOn).getTime() +
                                        7 * 24 * 60 * 60 * 1000 -
                                        new Date().getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    ) <= 0
                                      ? "Expired"
                                      : `${Math.ceil(
                                          (new Date(
                                            items.deliveredOn
                                          ).getTime() +
                                            7 * 24 * 60 * 60 * 1000 -
                                            new Date().getTime()) /
                                            (1000 * 60 * 60 * 24)
                                        )} days remaining`}
                                  </span>
                                )}
                              {items.orderStatus !== "Cancelled" &&
                                items.orderStatus !== "Returned" &&
                                items.orderStatus !== "Delivered" &&
                                items.orderStatus !== "Return Rejected" && (
                                  items.paymentStatus !== "Failed" &&
                                  <button
                                    onClick={() => {
                                      setOrderId(order._id);
                                      setItemId(items._id);
                                      handleCancel();
                                    }}
                                    className="px-3 py-2 border-2 border-black text-black text-xs sm:text-sm rounded-md hover:bg-black hover:text-white transition-colors mb-2 w-full sm:w-auto"
                                  >
                                    Cancel Order
                                  </button>
                                )}

                              {(() => {
                                const remainingDays = Math.ceil(
                                  (new Date(items.deliveredOn).getTime() +
                                    7 * 24 * 60 * 60 * 1000 -
                                    new Date().getTime()) /
                                    (1000 * 60 * 60 * 24)
                                );

                                return (
                                  items.orderStatus === "Delivered" &&
                                    !items?.returnReq?.requestStatus &&
                                  remainingDays > 0 && (
                                    <button
                                        onClick={() =>
                                          handleReturnReq(order._id, items._id)
                                        }
                                      className="px-3 py-2 border-2 border-black text-black text-xs sm:text-sm rounded-md hover:bg-black hover:text-white transition-colors mb-2 w-full sm:w-auto"
                                    >
                                      Return Order
                                    </button>
                                  )
                                );
                              })()}
                              {items.orderStatus === "Delivered" &&
                                items?.returnReq?.requestStatus && (
                                  <span className="text-yellow-400 font-semibold text-xs sm:text-sm">
                                    Return request is under processing
                                  </span>
                                )}
                              {items.orderStatus === "Return Rejected" && (
                                <span className="text-red-400 font-semibold text-xs sm:text-sm">
                                  Return request Rejected
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>

                    {order.orderItems.length > 2 && (
                      <button
                        onClick={() => toggleOrderExpansion(order._id)}
                        className="mt-4 text-xs sm:text-sm text-gray-600 hover:text-gray-900 underline transition-colors"
                      >
                        {expandedOrders.includes(order._id)
                          ? "View less"
                          : "View all products"}
                      </button>
                    )}
                  </div>

                  <div className="px-3 sm:px-4 lg:px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center">
                    <button
                      onClick={() => {
                        navigate(`/vieworderdetails/${order._id}`);
                      }}
                      className="px-3 py-2 bg-black text-white text-xs sm:text-sm rounded-md hover:bg-gray-800 transition-colors"
                    >
                      View Order Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <ConfirmationModal
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={onConfirm}
        />
        <ReturnConfirmation
          isOpen={isOpenReturn}
          onOpenChange={setIsOpenReturn}
          title={modalContent.title}
          message={modalContent.message}
          onConfirm={modalContent.onConfirm}
        />
      </div>
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </>
  );
}
