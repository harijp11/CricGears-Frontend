import { toast } from "sonner";
import React, { useState, useEffect } from "react";

function ContinuePayment({ total, onSuccess }) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleSubmit = () => {
    if (!isScriptLoaded) {
      toast.error("Payment system is initializing. Please try again in a moment.");
      return;
    }

    try {
      var options = {
        key: "rzp_test_fu3JZWbM4Hq2Jt",
        // Remove key_secret from frontend code for security!
        amount: total * 100,
        currency: "INR",
        name: "CricGears",
        description: "CricGears E-COMMERCE PAYMENT TESTING",
        handler: function (response) {
          console.log("called function");
          onSuccess();
        },
        prefill: {
          name: "Hari jp",
          email: "harijayaprakash10@gmail.com",
          contact: "7034019333",
        },
        notes: {
          address: "Razorpay Corporate office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const pay = new window.Razorpay(options);
      pay.open();
    } catch (error) {
      toast.error("Payment initialization failed. Please try again.");
      console.error("Razorpay error:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleSubmit}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow-md hover:shadow-lg transition-all duration-300 ease-in-out"
      >
        Continue Payment Rs {total}
      </button>
    </div>
  );
}

export default ContinuePayment;