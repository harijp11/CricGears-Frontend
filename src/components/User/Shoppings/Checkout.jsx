import React, { useEffect, useState } from "react";
import Address from "../profile/userAddress";
import { useSelector } from "react-redux";
import visa from "../../../assets/visa.png";
import master from "../../../assets/master.png";
import rupya from "../../../assets/rupya.png";
import verify from "../../../assets/verify.svg";
import Pending from "../../../assets/pending.svg";

import { toast } from "sonner";
import { Button } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { useNavigate } from "react-router-dom";
import PaymentComponent from "../../../util/paymentComponent";
import ConfirmationModal from "../../shared/confirmationModal";
import { applyCouponApi, updateCouponDataApi } from "../../../services/coupon";
import { fetchWalletInfoApi } from "../../../services/wallet";
import { fetchCartItemsAPI } from "../../../services/cartService";
import { checkProductAvailabilityAPI } from "../../../services/productsService";
import { placeOrderAPI } from "../../../services/orderService";

export default function Checkout() {
  const userData = useSelector((store) => store.user.userDatas);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const [total_amount, settotal_amount] = useState(0);
  const [total_discount, settotal_discount] = useState(0);
  const [coupon_Discount, setcoupon_Discount] = useState(0);
  const [total_price_with_discount, settotal_price_with_discount] = useState(0);

  const [couponCode, setCouponCode] = useState("");
  const [verifiedCouponCode, setverifiedCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const [Walletbalance, setWalletBalance] = useState(0);

  const [cart_id, setCart_id] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [orderDetails, setOrderDetails] = useState({});
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [placedAt, setPlacedAt] = useState(null);
  const [placedTime, setPlacedTime] = useState(null);

  const [failedPayment, setFailedPayment] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  const navigate = useNavigate();

  async function fetchCartItems() {
    try {
      const response = await fetchCartItemsAPI(userData._id);
      setCartItems(response.data.cartItems.items);
      setCart_id(response.data.cartItems._id);
      settotal_amount(response.data.cartItems.totalCartPrice);
      const offerDiscount = response.data.cartItems.totalDiscount || 0;
      settotal_discount(offerDiscount + coupon_Discount);
      if (response.data.cartItems.totalCartPrice <= 0) {
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      if (err.response) {
        return toast.error(err.response.data.message);
      }
    }
  }

  const handlePaymentMethodChange = async (event) => {
    setSelectedPaymentMethod(event.target.value);
    if (event.target.value === "wallet") {
      const response = await fetchWalletInfoApi(userData._id);
      setWalletBalance(response.data.myWallet.balance);
    } else {
      setWalletBalance(0);
    }
  };

  async function handlePlaceOrder(payment_status) {
    try {
      if (!selectedAddress) {
        return toast.warning("Select an address before placing order");
      }
      if (!selectedPaymentMethod) {
        return toast.warn("Select a Payment method before proceeding");
      }
  
      const cartResponse = await fetchCartItemsAPI(userData._id);

      const latestCartItems = cartResponse.data.cartItems.items;
      
      const latestTotalAmount = cartResponse.data.cartItems.totalCartPrice;
      
      // if (JSON.stringify(latestCartItems) !== JSON.stringify(cartItems) || 
      //     latestTotalAmount !== total_amount) {
      //   toast.warning("Item has been changed. Please check data order.");
      //   setCartItems(latestCartItems);
      //   settotal_amount(latestTotalAmount);
       
      //   return false;
      // }
  
      if (selectedPaymentMethod == "wallet") {
        payment_status = "Paid";
      } else if (typeof payment_status !== "string") {
        payment_status = "Pending";
      }
  
      const response = await checkProductAvailabilityAPI(latestCartItems);
  
      if (!response.data.success) {
        return toast.error(response.data.message);
      }
  
      const formattedPlaceDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setPlacedAt(formattedPlaceDate);
  
      const formattedTime = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setPlacedTime(formattedTime);
  
      const orderDate = new Date();
      const deliveryDatee = new Date(orderDate);
      deliveryDatee.setDate(orderDate.getDate() + 7);
  
      const formattedDate = deliveryDatee.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      setDeliveryDate(formattedDate);
  
      const orderPayload = {
      user: userData._id,
      cartItems: latestCartItems,
      total_amount: latestTotalAmount,
      total_discount,
      coupon_discount: coupon_Discount,
      total_price_with_discount,
      shipping_address: selectedAddress,
      payment_method: selectedPaymentMethod,
      payment_status,
      cart_id,
      deliveryDate: formattedDate,
    };

    const res = await placeOrderAPI(orderPayload);
  
      setOrderDetails(res?.data?.order);
  
      if (couponData) {
        handleUpdateCoupon(couponData._id, userData._id);
      }
      onOpen();
      return toast.success(res.data.message);
    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }
  }

  async function handleUpdateCoupon(coupon_id, user_id) {
    try {
      const response = await updateCouponDataApi(coupon_id, user_id);
    } catch (err) {
      console.log(err);
    }
  }

  function onExit() {
    navigate("/");
  }

  function onViewOrder() {
    navigate("/vieworders");
  }

  async function handleApplyCoupon() {
    try {
      const response = await applyCouponApi(couponCode);
      const data = response.data.CouponData;
      const userApplied = data.usersApplied.find(
        (userapplied) => userapplied.user == userData._id
      );

      if (userApplied && userApplied.used_count >= data.usageLimit) {
        return toast.warning("You have reached the maximum limit of the coupon usage");
      }
      setCouponData(data);

      const discountPercentage = data.discountValue;
      const calculatedDiscount = (total_amount * discountPercentage) / 100;
      if (data.minPurchaseAmount < total_amount) {
        setcoupon_Discount(calculatedDiscount);
        setverifiedCouponCode(data.code);
      } else {
        toast.warning("Sorry, the coupon is not valid for this purchase.");
        handleRemoveCoupon();
      }
    } catch (err) {
      if (err.response) {        
        toast.error(err.response.data.message);
      }
      console.error(err);
    }
  }

  function handleRemoveCoupon() {
    settotal_price_with_discount(total_price_with_discount + coupon_Discount);
    setcoupon_Discount(0);
    settotal_discount(total_discount - coupon_Discount);
    setCouponData(null);
    setCouponDiscount(0);
  }

  function handleWalletPayment() {
    if (Walletbalance < total_price_with_discount) {
      return toast.warning("Your wallet balance is insufficient to complete this payment");
    }

    setModalContent({
      title: "Wallet Payment",
      message: "You are about to complete this payment using your wallet balance. Do you want to proceed?",
      onConfirm: handlePlaceOrder,
    });
    setModalOpen(true);
  }

  useEffect(() => {
    fetchCartItems();
    if (couponData) {
      const discount = coupon_Discount;
      const maxDiscount = couponData.maxDiscountAmount;
      const minPurchaseAmount = couponData.minPurchaseAmount;

      if (total_amount > minPurchaseAmount) {
        const effectiveDiscount = Math.min(discount, maxDiscount);
        setcoupon_Discount(effectiveDiscount);
        settotal_price_with_discount(total_amount - effectiveDiscount);
      } else {
        toast.warning("Sorry, the coupon is not valid for this purchase.");
      }
    } else {
      settotal_price_with_discount(total_amount);
      setcoupon_Discount(0);
      setCouponData(null);
    }
  }, [total_discount, coupon_Discount, total_amount, couponData]);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onClose={onClose}
        className="bg-white border border-gray-200 shadow-xl rounded-lg max-w-md mx-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="mx-auto border-b border-gray-200 w-full text-center pb-4">Order Summary</ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center">
                  {orderDetails.orderItems?.every(
                    (item) => item.paymentStatus !== "Failed"
                  ) ? (
                    <img src={verify} alt="" className="h-20 my-5" />
                  ) : orderDetails.orderItems?.some(
                      (item) => item.paymentStatus === "Failed"
                    ) ? (
                    <img src={Pending} alt="" className="h-20 my-5" />
                  ) : (
                    <img src={Pending} alt="" className="h-20 my-5" />
                  )}

                  {orderDetails.orderItems?.every(
                    (item) => item.paymentStatus === "Paid"
                  ) ? (
                    <h2 className="flex text-lg font-semibold mb-4 text-green-600">Payment successfully Completed</h2>
                  ) : orderDetails.orderItems?.some(
                      (item) => item.paymentStatus === "Failed"
                    ) ? (
                    <h2 className="flex text-lg font-semibold mb-4 text-red-600">Order Placed. Payment Failed</h2>
                  ) : (
                    <h2 className="flex text-lg font-semibold mb-4 text-yellow-600">
                      Order Placed. Payment status pending
                    </h2>
                  )}

                  <Table aria-label="Order details table" className="my-7">
                    <TableHeader>
                      <TableColumn>OrderId</TableColumn>
                      <TableColumn className="text-right">
                        #{orderDetails?.orderId}
                      </TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow key="1">
                        <TableCell>Date</TableCell>
                        <TableCell className="text-right">{placedAt}</TableCell>
                      </TableRow>
                      <TableRow key="2">
                        <TableCell>Time</TableCell>
                        <TableCell className="text-right">{placedTime}</TableCell>
                      </TableRow>
                      <TableRow key="3">
                        <TableCell>Payment Method</TableCell>
                        <TableCell className="text-right">
                          {orderDetails?.paymentMethod}
                        </TableCell>
                      </TableRow>

                      {orderDetails?.couponDiscount > 0 && (
                        <TableRow key="5">
                          <TableCell>Coupon Discount</TableCell>
                          <TableCell className="text-right">
                            -INR {orderDetails?.couponDiscount}.00
                          </TableCell>
                        </TableRow>
                      )}

                      {orderDetails?.totalDiscount > 0 && (
                        <TableRow key="6">
                          <TableCell>Total Savings</TableCell>
                          <TableCell className="text-right">
                            -INR {orderDetails?.totalDiscount}.00
                          </TableCell>
                        </TableRow>
                      )}

                      <TableRow key="7">
                        <TableCell>Shipping Fee</TableCell>
                        <TableCell className="text-right">
                          {orderDetails?.shippingFee === 0
                            ? "Free"
                            : `INR ${orderDetails?.shippingFee}.00`}
                        </TableCell>
                      </TableRow>
                      <TableRow key="4">
                        <TableCell>Amount</TableCell>
                        <TableCell className="text-right">
                          INR {orderDetails?.total_price_with_discount.toFixed(2)}.00
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <h1 className="text-green-700 font-bold">
                    Arriving By {deliveryDate}
                  </h1>
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-200 pt-4">
                <Button color="danger" variant="light" onPress={onExit} className="bg-red-50 text-red-600 hover:bg-red-100 transition duration-300">
                  Continue Shopping
                </Button>
                <Button color="primary" onPress={onViewOrder} className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300">
                  View Order
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="mb-6 border-b border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Billing Details</h1>
        <div className="container mx-auto px-1 py-2 mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-blue-600 hover:text-blue-800 transition duration-300">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/cart" className="text-blue-600 hover:text-blue-800 transition duration-300">Cart </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-400" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900 font-semibold">Billing Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2 text-gray-800">
              Select an Address
            </h2>
            <div className="space-y-4">
              <Address
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
              />
            </div>
          </section>

          <section className="relative -mt-6">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2 text-gray-800">Payment Method</h2>
            <p className="mb-4 text-gray-600">Select any payment method</p>
            <div className="relative space-y-4">
              <label className="flex items-center justify-between cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-300">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="RazorPay"
                    className="w-5 h-5 border-2 border-gray-400 rounded-full mr-3"
                    onChange={handlePaymentMethodChange}
                    checked={selectedPaymentMethod === "RazorPay"}
                  />
                  <span className="text-gray-700">Razor Pay (Card/Net Banking/UPI)</span>
                </div>
                <div className="flex space-x-2">
                  <img src={master} alt="Mastercard" className="w-8 h-8" />
                  <img src={visa} alt="Visa" className="w-8 h-8" />
                  <img src={rupya} alt="Rupya" className="w-8 h-8" />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-300">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    className="w-5 h-5 border-2 border-gray-400 rounded-full mr-3"
                    onChange={handlePaymentMethodChange}
                    checked={selectedPaymentMethod === "wallet"}
                  />
                  <span className="text-gray-700">Wallet</span>
                </div>
              </label>

              {Walletbalance > 0 && (
                <div className="ml-8 mt-2 text-gray-700 font-medium flex items-center">
                  <span className="text-gray-500 mr-2">
                    Total Wallet Balance:
                  </span>
                  <span className="text-green-600">
                    Rs{Walletbalance.toFixed(2)}
                  </span>
                </div>
              )}

              <label className="flex items-center justify-between cursor-pointer p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-300">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash on Delivery"
                    className={`w-5 h-5 border-2 border-gray-400 rounded-full ${
                      total_price_with_discount < 1000 || total_price_with_discount > 10000
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onChange={handlePaymentMethodChange}
                    checked={selectedPaymentMethod === "Cash on Delivery"}
                    disabled={total_price_with_discount < 1000 || total_price_with_discount > 10000}
                  />
                  <div>
                    <span
                      className={`text-sm ${
                        total_price_with_discount < 1000 || total_price_with_discount > 10000
                          ? "opacity-70 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      Cash on delivery
                    </span>
                    {total_price_with_discount < 1000 && (
                      <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full ml-2">
                        Minimum order amount ₹1000
                      </span>
                    )}
                     {total_price_with_discount > 10000 && (
                      <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full ml-2">
                        Cash on delivery not vailable for above  ₹10000
                      </span>
                    )}
                  </div>
                </div>
              </label>
            </div>
          </section>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            {cartItems.map((item) =>
              item.qty >= 1 ? (
                <div key={item._id} className="flex items-center mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                  <div className="w-16 h-20 bg-gray-100 mr-4 overflow-hidden rounded-md shadow-sm">
                    <img
                      src={item?.productId?.images[0]}
                      alt={item?.productId?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-sm text-gray-800">{item.productId.name}</h3>
                    <p className="text-sm text-gray-600">Unit price: ₹{item.salePrice.toFixed(2)}</p>
                    <p className="text-sm font-medium text-gray-700">Total: ₹{item.totalProductPrice.toFixed(2)}</p>
                    {item.discountedAmount > 0 && (
                      <p className="text-xs text-green-600">
                        You saved ₹{item.discountedAmount.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">Size: {item.size}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-700">QTY: {item.qty}</p>
                </div>
              ) : null
            )}

            <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-800">₹{total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              {verifiedCouponCode && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coupon Code:</span>
                  <span className="font-medium text-blue-600">{verifiedCouponCode}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coupon Discount:</span>
                  <span className="text-green-600">{couponDiscount.toFixed(2)}%</span>
                </div>
              )}
              {coupon_Discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coupon Discount Amount:</span>
                  <span className="text-green-600">-₹{coupon_Discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg pt-2">
                <span className="text-gray-800">Total:</span>
                <span className="text-blue-600">₹{total_price_with_discount.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex">
              <input
                type="text"
                placeholder="Coupon code"
                className="flex-grow border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase());
                }}
              />
              <button
                onClick={couponData ? handleRemoveCoupon : handleApplyCoupon}
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition duration-300"
              >
                {couponData ? 'Remove Coupon' : 'Apply Coupon'}
              </button>
            </div>

            {selectedPaymentMethod === "Cash on Delivery" && (
              <button
                onClick={handlePlaceOrder}
                className="mt-6 w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 font-semibold text-lg"
              >
                Place Order
              </button>
            )}
            {selectedPaymentMethod === "RazorPay" && selectedAddress && (
              <PaymentComponent
                total={total_price_with_discount.toFixed(2)}
                handlePlaceOrder={handlePlaceOrder}
                cartItems={cartItems}
                 userData={userData} 
              />
            )}
            {selectedPaymentMethod === "wallet" && selectedAddress && (
              <button 
                onClick={handleWalletPayment}
                className="mt-6 w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 font-semibold text-lg"
              >
                Pay with your wallet
              </button>
            )}
            {!selectedPaymentMethod || !selectedAddress ? (
              <Button className="mt-6 w-full py-3 bg-gray-400 text-white rounded-md font-semibold text-lg cursor-not-allowed">
                Select a payment method and Address
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={modalOpen}
        onOpenChange={setModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
      />
    </div>
  );
}

