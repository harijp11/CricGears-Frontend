import axiosInstance from "../../AxiosInstance";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OTPVerification } from "./OTPverification";
import {ArrowLeft} from "lucide-react"
import { toast } from "sonner";
import { forgotPassword,verifyForgotPasswordOtp  } from "../../services/authService";


export default function ForgotPassword(){
    const [email, setEmail] = useState("");
    const navigate = useNavigate()
    const [isOTPDialogOpen,setIsOTPDialogOpen] = useState(false)


    const sendOtp=async()=>{
      try{
        const response = await forgotPassword(email)
        toast.success(response.data.message)
        setIsOTPDialogOpen(true)
        // console.log(response.data.otp); 
       }catch(err){
        if (err.response && err.response.status === 404) {
            return toast.error(err.response.data.message);
          }
          toast.error(err.response.data.message);
        //   toast.error("An error occurred. Please try again.");
       }
    }

   async function handleSubmit(e){
       e.preventDefault()
       try{
       await sendOtp()
       }catch(err){
        console.log(err);
          toast.error("Resetpassword failed, try again");
        //   toast.error("An error occurred. Please try again.");
       }
   }

   const handleVerify=async(otp)=>{
   try{
    const response=await verifyForgotPasswordOtp(email,otp) 
    const _id = response.data._id
    toast.success(response.data.message)
      setTimeout(()=> navigate(`/resetpassword/${_id}`))
    setIsOTPDialogOpen(false)
    return toast.success(response.data.message)
   }catch(err){
    if (err.response && err.response.status === 404) {
        return toast.error(err.response.data.message);
      }
    //   toast.error("An error occurred. Please try again.");
    console.log(err);
    }
    setIsOTPDialogOpen(false);
   }


   return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div class="fixed left-3 top-3">
          <button
            onClick={() => navigate("/login")}
            className="absolute left-0 top-0 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          </div>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
          Forgot Password
        </h2>
        <p className='text-gray-600 mb-6 text-center'>
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'>
              Email Address
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500'
              required
              placeholder='Enter your email'
            />
          </div>
          <button
            type='submit'
            className='w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'>
            Reset Password
          </button>
        </form>
      </div>
      <OTPVerification
      onResend={sendOtp}
        isOpen={isOTPDialogOpen}
        onClose={() => setIsOTPDialogOpen(false)}
        onVerify={handleVerify}
        email={email}
      />
    </div>
  );
}