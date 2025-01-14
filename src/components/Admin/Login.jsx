import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../ui/button";
import { toast,Toaster } from "sonner";
import axiosInstace from "../../AxiosInstance"
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { addAdmin } from "../../redux/Slice/AdminSlice";
import store from "../../redux/Store";
import loginImg from "../../assets/picsart_version-rGc4ycOkG-transformed.jpeg"


function Login() {
  const dispatch = useDispatch();
  const adminData = useSelector((store) => store.admin.adminDatas);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

   const handleLogin=async(e)=>{
    e.preventDefault();
    try{      
      const response = await axiosInstace.post("/admin/login",{
        email,password
      })
      // console.log(response);
      dispatch(addAdmin(response.data.adminData))
      navigate("/admin/home")
      return toast.success(response.data.message)
    }catch(err){
      if(err.response && err.response.status===401){
        return toast.error(err.response.data.message)
      }
      toast.error("An error occured.please try again ")
      console.log(err);
      
    }
   }
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
          <h1 className="text-4xl font-bold mb-2 tracking-tight relative ">CricGears</h1>
          <h2 className="text-xl font-semibold text-black-300 relative -bottom-5">Admin Login</h2>
        </div>
        <form className="p-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-black transition duration-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Login
          </Button>
        </form>
        <div className="px-8 pb-8 text-center">
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;