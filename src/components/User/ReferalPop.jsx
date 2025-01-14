import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "../../AxiosInstance";

const ReferalPop = ({ isOpen, setIsOpen, setReferalCode,referalCode }) => {
 
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Enter Referral Code</h2>
        
        <input
          type="text"
          value={referalCode}
          onChange={(e) => setReferalCode(e.target.value)}
          placeholder="Enter your referral code"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <button
          onClick={()=>setIsOpen(false)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Code
        </button>
      </div>
    </div>
  );
};

export default ReferalPop;