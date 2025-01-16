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

    <div className="max-w-6xl mx-auto bg-gray-100 rounded-lg shadow-md p-6 sm:p-12">
      {/* Header and Buttons Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-semibold mb-4 sm:mb-0">Details</h2>
        {!isEditing && (
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate("/changepassword")}
              className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors text-center"
            >
              Change Password
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors text-center"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      {/* Profile Details Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError(prev => ({
                      ...prev,
                      name: ''
                    }));
                  }}
                  className="shadow-sm focus:ring-black focus:border-black focus:bg-black bg-gray-300 block w-full h-12 text-lg pl-4 border-gray-300 rounded-md"
                />
                {error.name && (
                  <span className="text-red-600 text-sm mt-1">
                    {error.name}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-lg text-gray-900">{userData.name}</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <p className="text-lg text-gray-900">{userData?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError(prev => ({
                      ...prev,
                      phone: ''
                    }));
                  }}
                  className="shadow-sm focus:ring-black focus:border-black focus:bg-black bg-gray-300 block w-full h-12 text-lg pl-4 border-gray-300 rounded-md"
                />
                {error.phone && (
                  <span className="text-red-600 text-sm mt-1">
                    {error.phone}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-lg text-gray-900">{userData?.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Buttons Section */}
      {isEditing && (
        <div className="flex flex-col sm:flex-row gap-4 justify-start mb-8">
          <button
            onClick={() => setIsEditing(false)}
            className="w-full sm:w-auto bg-gray-200 text-black px-6 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            Update Profile
          </button>
        </div>
      )}

      {/* Quick Links Section */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/vieworders"
            className="w-full sm:w-auto bg-white text-black border border-black px-6 py-2 rounded hover:bg-gray-100 transition-colors text-center"
          >
            Order Details
          </Link>
          <Link
            to="/wallet"
            className="w-full sm:w-auto bg-white text-black border border-black px-6 py-2 rounded hover:bg-gray-100 transition-colors text-center"
          >
            My Wallet
          </Link>
          <Link
            to="/viewcoupons"
            className="w-full sm:w-auto bg-white text-black border border-black px-6 py-2 rounded hover:bg-gray-100 transition-colors text-center"
          >
            Coupons
          </Link>
        </div>
      </div>
    </div>

    <div className="mt-8">
      <Address
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
    </div>

    <div className="mt-8">
      <UserReferral />
    </div>
  </div>
  );
}

export default Myprofile;
