import { toast } from "sonner";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../AxiosInstance";
import { lockAllItems, unlockItems } from "../services/productsService";

function PaymentComponent({ total, handlePlaceOrder, cartItems }) {
  const navigate = useNavigate();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [orderProcessed, setOrderProcessed] = useState(false);
  
  // Use useRef to ensure immediate synchronous updates
  const orderProcessedRef = useRef(false);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => {
        toast.error("Failed to load payment system");
        setIsScriptLoaded(false);
      };
      document.body.appendChild(script);
    } else {
      setIsScriptLoaded(true);
    }

    return () => {
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const checkProductAvailability = async () => {
    try {
      const res = await axiosInstance.post("/user/product/available", {
        cartItems,
      });
      if (!res.data.success) {
        toast.error(res.data.message);
        navigate("/checkout");
        return false;
      }
      return true;
    } catch (err) {
      toast.error("Error checking product availability!");
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!isScriptLoaded) {
      toast.error("Payment system not loaded. Please refresh.");
      return;
    }

    try {
      const isAvailable = await checkProductAvailability();
      if (!isAvailable) {
        toast.warning("Product is not available.");
        return;
      }

      const res = await lockAllItems(cartItems);
      if (!res.data.success) {
        console.log("lock response", res);
        toast.error(res.message);
        return;
      }

      setPaymentInProgress(true);
      setOrderProcessed(false);
      orderProcessedRef.current = false;
      
      const options = {
        key: "rzp_test_fu3JZWbM4Hq2Jt",
        amount: Math.round(total * 100),
        currency: "INR",
        name: "CRICGEARS",
        description: "CRICGEARS E-COMMERCE PAYMENT",
        handler: function (response) {
            if (orderProcessedRef.current) return;
            orderProcessedRef.current = true;
            setOrderProcessed(true); 
          if (response.razorpay_payment_id) {
            handlePlaceOrder("Paid");
          } 
          else {
            toast.error("Payment failed. Please try again.");
            navigate("/checkout");
          }
          setPaymentInProgress(false);
        },
        prefill: {
          name: "Hari jp",
          email: "cricgears17@gmail.com",
          contact: "7034019333",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: async function () {
            try {
              setPaymentInProgress(false);
              await unlockItems(cartItems);
              toast.info("Payment cancelled, items unlocked.");
            } catch (error) {
              console.error("Unlock failed:", error);
              toast.error("Failed to unlock items");
              navigate("/cart")
            } finally {
              navigate("/checkout");
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on("payment.failed", function (response) {
          if (orderProcessedRef.current) return;        
          orderProcessedRef.current = true;   
          setOrderProcessed(true);   

        handlePlaceOrder("Failed");
        setPaymentInProgress(false); 
        rzp.close();  
        navigate("/checkout");
      });
      
      rzp.open();
    } catch (error) {
      setPaymentInProgress(false);
      toast.error(error.response.data.message);
      // toast.error("Payment initialization failed");
      setTimeout(() => navigate("/cart"), 1500);
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={!isScriptLoaded || paymentInProgress}
      className={`bg-black text-white mt-4 w-full h-16 rounded-md ${
        !isScriptLoaded || paymentInProgress
          ? "opacity-50 cursor-not-allowed"
          : ""
      }`}
    >
      {!isScriptLoaded
        ? "Loading Payment..."
        : paymentInProgress
        ? "Processing Payment..."
        : "Pay with RazorPay"}
    </button>
  );
}

export default PaymentComponent;