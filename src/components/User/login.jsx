import { Label } from "../ui/label";
import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Input } from "../ui/Input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../ui/button";

import axiosInstance from "../../AxiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
// import { toast as reactToast, ToastContainer } from 'sonner';
import { toast, Toaster } from "sonner";
import { addUser } from "../../redux/Slice/UserSlice";

export function Login() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleData, setGoogleData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/user/login", {
        email,
        password,
      });
      dispatch(addUser(response.data.userData));
      navigate("/");
      return toast.success(response.data.message);
    } catch (err) {
      console.error("Full error details:", err);
      console.error("Error response:", err.response);
      console.error("Error request:", err.request);

      if (err.response) {
        // The request was made and the server responded with a status code
        switch (err.response.status) {
          case 401:
            return toast.error(err.response.data.message);
          case 404:
            return toast.error(err.response.data.message);
          case 403:
            return toast.error(
              <>
                <strong>Error 403:</strong>
                {err.response.data.message}
                <br />
                <strong>Contact the Admin for Further Details</strong>
              </>
            );
          case 500:
            return toast.error(
              "Internal Server Error. Please try again later."
            );
          default:
            return toast.error("An unexpected error occurred.");
        }
      } else if (err.request) {
        // The request was made but no response was received
        return toast.error(
          "No response received from server. Check your network connection."
        );
      } else {
        // Something happened in setting up the request
        return toast.error("Error setting up the request. Please try again.");
      }
    }
  };
  return (
    <>
      <Toaster position="top-right" richColors />
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          background: "linear-gradient(to bottom, black, white)",
        }}
      >
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-white text-black p-8 text-center">
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              CricGears
            </h1>
            <h2 className="text-xl font-semibold text-gray-600 relative -bottom-5">
              Log In
            </h2>
          </div>
          <form className="p-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
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
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
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
            <div className="text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <div
                  className="flex items-center"
                >
                  <span>Don't Have an Account? </span>
                  <button
                    onClick={() => navigate("/signup")}
                    className="font-medium text-black hover:text-gray-800 transition duration-200 ml-1"
                  >
                    Signup
                  </button>
                </div>

                <div>
                  <a
                    href="#"
                    onClick={() => navigate("/forgotpassword")}
                    className="text-sm text-gray-600 hover:text-black transition duration-200"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>
          </form>

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
                    console.log(credentialResponse);

                    const decodeData = jwtDecode(credentialResponse.credential);
                    setGoogleData(decodeData);

                    const response = await axiosInstance.post(
                      "/user/googleAuth",
                      {
                        token: credentialResponse.credential,
                      }
                    );

                    if (response.data.success) {
                      // Check if it's a Google user
                      const isGoogleUser = response.data.user.isGoogleUser;

                      dispatch(
                        addUser({
                          ...response.data.user,
                          isGoogleUser,
                        })
                      );

                      toast.success("Login successful");
                      navigate("/home");
                    }
                  } catch (err) {
                    if (err.response && err.response.status === 401) {
                      return toast.error(err.response.data.message);
                    }
                    toast.error("An error occurred. Please try again.");
                    console.log(err);
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
      </div>
    </>
  );
}

export default Login;
