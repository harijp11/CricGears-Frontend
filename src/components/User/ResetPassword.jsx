import axiosInstance from "../../AxiosInstance";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";

export default function  ResetPassword(){
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [errors,setErrors]=useState({})


    const validatePassword = () => {
      const newErrors = {};
  
      if (newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters long";
      }else{
  
      // Password complexity validation
      const hasUpperCase = /[A-Z]/.test(newPassword);
      const hasLowerCase = /[a-z]/.test(newPassword);
      const hasNumbers = /\d/.test(newPassword);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  
      if (!hasUpperCase) {
        newErrors.newPassword = (newErrors.newPassword || "") + "\nMust contain at least one uppercase letter";
      }else
      if (!hasLowerCase) {
        newErrors.newPassword = (newErrors.newPassword || "") + "\nMust contain at least one lowercase letter";
      }else
      if (!hasNumbers) {
        newErrors.newPassword = (newErrors.newPassword || "") + "\nMust contain at least one number";
      }else
      if (!hasSpecialChar) {
        newErrors.newPassword = (newErrors.newPassword || "") + "\nMust contain at least one special character";
      }
    }
      // Check for common passwords
      const commonPasswords = ["password", "123456", "qwerty", "admin123"];
      if (commonPasswords.includes(newPassword.toLowerCase())) {
        newErrors.newPassword = "Please choose a stronger password";
      }
  
      // Password match validation
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
  
      return newErrors;
    };


    const handleSubmit=async(e)=>{
        e.preventDefault()

        const validationErrors = validatePassword();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          const errorMessage = Object.values(validationErrors)[0];
          toast.error("enter valide password");
          return;
        }

        try{
           const response = await axiosInstance.post(`/user/resetpassword`, {
            newPassword,
            confirmPassword,
            _id:id,
           })
           navigate("/login")
           return toast.success(response.data.message);
        }catch(err){
          console.log(err);
          return toast.error(err.response.data.message)
        }
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Reset Password
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Please enter your new password below. Make sure it's strong and unique.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors({});
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 ${
                  errors.newPassword ? "border-red-500" : "border-gray-300"
                }`}
                required
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <div className="text-sm text-red-500 mt-1 whitespace-pre-line">
                {errors.newPassword}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors({});
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                required
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </div>
            )}
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Password must:</p>
            <ul className="list-disc pl-5">
              <li>Be at least 8 characters long</li>
              <li>Include at least one uppercase letter</li>
              <li>Include at least one lowercase letter</li>
              <li>Include at least one number</li>
              <li>Include at least one special character (!@#$%^&*)</li>
            </ul>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}