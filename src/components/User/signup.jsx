import React, { useState } from "react";
import { EyeIcon, EyeOffIcon, Mail } from "lucide-react";
import { OTPVerification } from "./OTPverification";
import axiosInstance from "../../AxiosInstance";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { addUser } from "../../redux/Slice/UserSlice";
import { useDispatch } from "react-redux";
import { toast,Toaster } from "sonner";

import { Input } from "../ui/Input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { validateSignupForm } from "../../util/signUpValidation";
import ReferalPop from "./ReferalPop";

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [googleData,setGoogleData] = useState(null)
  const [error, setError] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [isReferalOpen, setIsReferalOpen] = useState(false);
  const [referalCode, setReferalCode] = useState("");
  // Handle signup form submission

  const sendOtp= async () => {
    try {
      toast.success("Generating OTP please wait");
      const response = await axiosInstance.post("/user/sendotp", { email });
      toast.success(response.data.message);
    } catch (err) {
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred while sending OTP");
      }
      throw err;  // Propagate error for handling in signup
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const validationErrors = validateSignupForm({
      username,
      email,
      password,
      confirm,
      phone,
    });

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    setError({});

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await sendOtp();
      setIsOtpDialogOpen(true);
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  const handleOtpVerify = async (otp) => {
    try {
      const response = await axiosInstance.post("/user/register", {
        name:username,
        email,
        phone,
        password,
        otp,
        usedReferal:referalCode
      });
      toast.success("register success")
      setTimeout(()=>navigate("/login"),3000)
      
      setIsOtpDialogOpen(false);
      // console.log(response.data.message);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        toast.error(response.data.message)
        console.error(err.response.data.message);
      } else if (err.response && err.response.status === 401) {
        toast.error(response.data.message)
        console.error(err.response.data.message);
      }
      toast.error("An error occurred. Please try again.")
      console.error("An error occurred. Please try again.");
    }
    setIsOtpDialogOpen(false);
  };

  return (
    <>
    <Toaster position="top-right" richColors/>
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(to bottom, black, white)",
      }}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-white text-black p-8 text-center">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">CricGears</h1>
          <h2 className="text-xl font-semibold text-gray-600 relative -bottom-5">Sign Up</h2>
        </div>
        <form className="p-8 space-y-6" onSubmit={handleSignup}>
          <div className="space-y-2">
            <label htmlFor="username" className="text-gray-700 font-medium">Username</label>
            <Input
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError((prev) => ({ ...prev, username: "" }))}}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
              required
            />
            {error.username && <span className="text-red-500 text-sm">{error.username}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError((prev) => ({ ...prev, email: "" }))}}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
              required
            />
            {error.email && <span className="text-red-500 text-sm">{error.email}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-700 font-medium">Password</label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError((prev) => ({ ...prev, password: "" }))}}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black transition duration-200"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {error.password && <span className="text-red-500 text-sm">{error.password}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setError((prev) => ({ ...prev, confirm: "" }))}}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black transition duration-200"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {error.confirm && <span className="text-red-500 text-sm">{error.confirm}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</label>
            <Input
              id="phone"
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError((prev) => ({ ...prev, phone: "" }))}}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
            />
            {error.phone && <span className="text-red-500 text-sm">{error.phone}</span>}
          </div>
          <div className="space-y-2">
          <Button 
              type="button"
              onClick={() => setIsReferalOpen(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-black font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
            >
            {referalCode ? referalCode : 'Have a Referral Code?'}
            </Button>
            
          </div>
     
          <Button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Sign Up
          </Button>
        </form>
        <div className="px-8 pb-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-black hover:text-gray-800 transition duration-200">
              Login Now
            </a>
          </p>
        </div>
        <div className="px-8 pb-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or Continue with
              </span>
            </div>
          </div>
          <div className="mt-6">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  // console.log(credentialResponse);
                  
                  const decodeData = jwtDecode(credentialResponse.credential);
                  
                  setGoogleData(decodeData);
                  // console.log("googlelogin==>", decodeData)

                  const response = await axiosInstance.post("/user/googleAuth", {
                    token: credentialResponse.credential
                  });

                  if (response.data.success) {
                    // Check if it's a Google user
                    const isGoogleUser = response.data.user.isGoogleUser;
                    
                    dispatch(addUser({
                      ...response.data.user,
                      isGoogleUser
                    })); 
                    
                    toast.success("Login successful");
                    navigate("/home");
                  }
                } catch (err) {
                  if (err.response && err.response.status === 401) {
                    return toast.error(err.response.data.message);
                  }
                  toast.error("An error occurred. Please try again.");
                  console.log(err)
                }
              }}
              onError={() => {
                console.log("Login Failed");
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <ReferalPop 
          isOpen={isReferalOpen}
          setIsOpen={setIsReferalOpen}
          setReferalCode={setReferalCode}
          referalCode={referalCode}
          // user_id={user_id} // Add user_id from your auth context or state
        />
      <OTPVerification
        handleSignUp={handleSignup}
        isOpen={isOtpDialogOpen}
        onClose={() => setIsOtpDialogOpen(false)}
        onVerify={handleOtpVerify}
        email={email} 
        onResend={sendOtp}
      />
    </div>

</>
  );
}
