import axiosInstance from "../../../AxiosInstance";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../../../redux/Slice/UserSlice";
import { toast } from "sonner";
import Address from "./userAddress";
import { validateProfile } from "../../../util/EditProfilevalidation";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import UserReferral from "./ReferAndEarn";

function Myprofile() {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userDatas);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [name, setName] = useState(userData?.name ?? "");
  const [phone, setPhone] = useState(userData?.phone ?? "");
  const [error, setError] = useState({});
  const [selectedAddress, setSelectedAddress] = useState();
  const navigate=useNavigate()

  async function handleUpdate() {
    const formData = {
      name,
      phone,
    };

    const { isValid, errors: validationErrors } = validateProfile(formData);

    if (!isValid) {
      setError(validationErrors);
      return;
    }

    try {
      const response = await axiosInstance.put("/user/editUser", {
        userId: userData._id,
        email: userData.email,
        name,
        phone,
      });
      dispatch(addUser(response.data.user));
      setIsEditing(false);
      toast.success("Profile Updated Successfully");
    } catch (err) {
      console.error("Full error:", err);
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        return toast.error(err.response.data.message || "Update failed");
      } else if (err.request) {
        console.error("Request error:", err.request);
        return toast.error("No response received from server");
      } else {
        console.error("Error:", err.message);
        return toast.error("An error occurred");
      }
    }
  }

  return (
    <div className="bg-white text-black min-h-screen p-4 sm:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">My Profile</h1>
      <div className="container mx-auto px-1 mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-gray-600 hover:text-black">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">My Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="text-sm mb-8"></div>
      </div>
      <div className="max-w-6xl mx-auto bg-gray-100 rounded-lg shadow-md p-6 sm:p-12">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
            <h2 className="text-2xl font-semibold">Details</h2>
            {!isEditing && (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/changepassword")}
                  className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-center"
                >
                  Change Password
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-center"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* ... rest of the profile form content ... */}

          {isEditing && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-4">
              <button
                onClick={() => setIsEditing(false)}
                className="w-full sm:w-auto bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Update Profile
              </button>
            </div>
          )}

          <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-4">
            <Link
              to="/vieworders"
              className="w-full sm:w-auto bg-white text-black border border-black px-4 py-2 rounded hover:bg-gray-100 transition-colors text-center"
            >
              Order Details
            </Link>
            <Link
              to="/wallet"
              className="w-full sm:w-auto bg-white text-black border border-black px-4 py-2 rounded hover:bg-gray-100 transition-colors text-center"
            >
              My Wallet
            </Link>
            <Link
              to="/viewcoupons"
              className="w-full sm:w-auto bg-white text-black border border-black px-4 py-2 rounded hover:bg-gray-100 transition-colors text-center"
            >
              Coupons
            </Link>
          </div>
        </div>
      </div>

      <Address
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />

      <UserReferral />
    </div>
  );
}

export default Myprofile;
