import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../AxiosInstance";

function PaymentComponent({ total, handlePlaceOrder, cartItems, userData }) {
  const navigate = useNavigate();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
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

  const validateCartBeforePayment = async () => {
    try {
      // Fetch latest cart data
      const cartResponse = await axiosInstance.get(`/user/fetchCart/${userData._id}`);
      const latestCartItems = cartResponse.data.cartItems.items;
      
      // Compare only relevant cart item properties
      const cartChanged = !cartItems.every(item => {
        const latestItem = latestCartItems.find(latest => latest.productId._id === item.productId._id);
        return latestItem && 
               latestItem.qty === item.qty && 
               latestItem.size === item.size;
      });
      
      if (cartChanged) {
        toast.info("Cart data has changed. Please review your order.");
        navigate("/cart");
        return false;
      }

      // Check product availability
      const availabilityResponse = await axiosInstance.post("/user/product/available", {
        cartItems: latestCartItems,
      });

      if (!availabilityResponse.data.success) {
        toast.error(availabilityResponse.data.message);
        navigate("/cart");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Cart validation error:", error);
      toast.error("Failed to validate cart data");
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!isScriptLoaded) {
      toast.error("Payment system not loaded. Please refresh.");
      return;
    }

    try {
      setPaymentInProgress(true);

      // Single validation before payment
      const isValid = await validateCartBeforePayment();
      if (!isValid) {
        setPaymentInProgress(false);
        return;
      }

      const options = {
        key: "rzp_test_fu3JZWbM4Hq2Jt",
        amount: total * 100,
        currency: "INR",
        name: "CRICGEARS",
        description: "CRICGEARS E-COMMERCE PAYMENT",
        handler: async function(response) {
          if (response.razorpay_payment_id) {
            // Proceed directly to order placement on successful payment
            handlePlaceOrder("Paid");
          } else {
            toast.error("Payment failed. Please try again.");
            setPaymentInProgress(false);
          }
        },
        prefill: {
          name: "Hari jp",
          email: "cricgears17@gmail.com",
          contact: "7034019333"
        },
        theme: {
          color: "#3399cc"
        },
        modal: {
          ondismiss: function() {
            setPaymentInProgress(false);
            toast.info("Payment cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function(response) {
        setPaymentInProgress(false);
        handlePlaceOrder("Failed");
      });
      rzp.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      setPaymentInProgress(false);
      toast.error("Payment initialization failed");
    }
  };

  return (
    <button
      onClick={handleSubmit}
      disabled={!isScriptLoaded || paymentInProgress}
      className={`bg-black text-white mt-4 w-full h-16 rounded-md ${
        !isScriptLoaded || paymentInProgress ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {!isScriptLoaded 
        ? 'Loading Payment...' 
        : paymentInProgress 
          ? 'Processing Payment...' 
          : 'Pay with RazorPay'
      }
    </button>
  );
}

export default PaymentComponent;