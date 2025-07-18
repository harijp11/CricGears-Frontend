import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Edit, Trash2, Plus, X } from "lucide-react";
import axiosInstance from "../../../AxiosInstance";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { validateAddressForm } from "../../../util/addressValidation";
import PropTypes from "prop-types";
import { addUserAddressAPI, deleteUserAddressAPI, editUserAddressAPI, getUserAddressesAPI } from "../../../services/addressService";

export default function Address({ selectedAddress, setSelectedAddress }) {
  const userData = useSelector((store) => store.user.userDatas);
  const [addresses, setAddresses] = useState([]);
  const [reload, setReload] = useState(false);

  async function fetchAddress() {
    try {
      const response = await getUserAddressesAPI(userData._id);
      setSelectedAddress(response.data.address[0]);
      // console.log("setselectedaddresss==>", selectedAddress);

      setAddresses(response.data.address);
    } catch (err) {
      if (err.response) {
        return toast.error(err.response.data.message);
      }
      console.log(err);
    }
  }

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Individual state variables for each field
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState({});


  const validateForm = () => {
    const formData = {
      name,
      email,
      phone,
      address,
      landmark,
      pincode,
      city,
      district,
      state
    };

    const { isValid, errors } = validateAddressForm(formData);
    setError(errors);
    return isValid;
  };

  async function handleAddAddress() {

    if (!validateForm()) {
        toast.error("Please fix the errors in the form");
        return;
      }
    try {
      const newAddress = {
        user: userData._id,
        name,
        email,
        phone,
        address,
        pincode,
        landmark,
        city,
        district,
        state,
      };

      const response = await addUserAddressAPI(userData._id, newAddress);

      resetForm();
      setIsAdding(false);
      return toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      return toast.error(err.response.data.message);
    }
  }

  const handleEditAddress = (address) => {
    setName(address.name);
    setEmail(address.email);
    setPhone(address.phone);
    setAddress(address.address);
    setPincode(address.pincode);
    setLandmark(address.landmark);
    setCity(address.city);
    setDistrict(address.district);
    setState(address.state);
    setEditingId(address._id);
    setIsAdding(true);
  };

  const handleUpdateAddress = async (e) => {
    try {
      // Prevent default form submission if event is passed
      e?.preventDefault();

      // Validate input fields before submission
      // if (!name || !email || !phone || !address || !pincode) {
      //     return toast.error("Please fill all required fields");
      // }
      if (!validateForm()) {
        toast.error("Please fix the errors in the form");
        return;
      }
      const newAddress = {
        _id: editingId,
        name,
        email,
        phone,
        address,
        pincode,
        landmark,
        city,
        district,
        state,
      };

      const response = await editUserAddressAPI(userData._id, newAddress);

      // Reset form and state after successful update
      resetForm();
      setIsAdding(false);
      setEditingId(null);

      // Show success toast
      toast.success(response.data.message || "Address updated successfully");
    } catch (err) {
      // Improved error handling
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update address";

      console.error(err);
      toast.error(errorMessage);
    }
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  async function handleDeleteAddress(address) {
    try {
      const response = await deleteUserAddressAPI(address._id);
      setReload(true);
      return toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      return toast.error(err.response.data.message);
    }
  }

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPincode("");
    setLandmark("");
    setCity("");
    setDistrict("");
    setState("");
    setError({});
  };

  const handleCancel = () => {
    resetForm();
    setIsAdding(false);
    setEditingId(null);
    // setReload(false);
    setDeleteConfirmOpen(false)
  };

  useEffect(() => {
    fetchAddress();
    setReload(false);
  }, [isAdding, reload]);

  return (
    <div className="flex items-start justify-center pt-0">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 w-full max-w-6xl mt-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Addresses</h2>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center text-gray-600 hover:text-black transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Add New Address
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              onClick={
                selectedAddress
                  ? () => setSelectedAddress(address)
                  : undefined
              }
              key={address._id}
              className={`bg-gray-50 border ${
                selectedAddress === address ? "border-black" : "border-gray-200"
              } rounded-lg p-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{address.name}</h3>
                <div className="flex space-x-2">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(address);
                    }}
                  >
                    <Edit size={18} />
                  </button>
                  {/* {selectedAddress ? (
                  ""
                ) : ( */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      //   handleDeleteAddress(address);
                      setDeleteConfirmOpen(true);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 size={18} />
                  </button>
                  <Dialog
                    open={deleteConfirmOpen}
                    onOpenChange={setDeleteConfirmOpen}
                  >
                    <DialogContent className="bg-white">
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this address? This
                          action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="bg-black text-white hover:bg-gray-800"
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address);
                            setDeleteConfirmOpen(false);
                            setEditingId(false);
                            setIsAdding(false);
                            resetForm()
                          }}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {/* )} */}
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p className="flex items-center text-gray-600">
                  <MapPin size={16} className="mr-2" />
                  {address.address}, {address.landmark}
                </p>
                <p className="flex items-center text-gray-600">
                  <Mail size={16} className="mr-2" />
                  {address.email}
                </p>
                <p className="flex items-center text-gray-600">
                  <Phone size={16} className="mr-2" />
                  {address.phone}
                </p>
                <p className="text-gray-600">
                  {address.city}, {address.district}, {address.state} -{" "}
                  {address.pincode}
                </p>
              </div>
            </div>
          ))}
        </div>

        {isAdding && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>{setName(e.target.value);setError((prev) => ({ ...prev, name: "" }))}}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {error.name && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.name}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="email"
                  value={email}
                  onChange={(e) =>{setEmail(e.target.value);setError((prev) => ({ ...prev, email: "" }))}}
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {error.email && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.email}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>{setPhone(e.target.value);setError((prev) => ({ ...prev, phone: "" }))}}
                  placeholder="Phone Number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {error.phone && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.phone}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={address}
                  onChange={(e) =>{setAddress(e.target.value);setError((prev) => ({ ...prev, address: "" }))}}
                  placeholder="Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {error.address && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.address}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) =>{setLandmark(e.target.value);setError((prev) => ({ ...prev, landmark: "" }))}}
                  placeholder="Landmark"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {error.landmark && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.landmark}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) =>{ setPincode(e.target.value);setError((prev) => ({ ...prev, pincode: "" }))}}
                  placeholder="Pincode"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {error.pincode && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.pincode}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={city}
                  onChange={(e) =>{ setCity(e.target.value);setError((prev) => ({ ...prev, city: "" }))}}
                  placeholder="City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {error.city && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.city}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={district}
                  onChange={(e) =>{ setDistrict(e.target.value);setError((prev) => ({ ...prev, district: "" }))}}
                  placeholder="District"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {error.district && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.district}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  value={state}
                  onChange={(e) =>{ setState(e.target.value);setError((prev) => ({ ...prev, state: "" }))}}
                  placeholder="State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                {error.state && (
                  <span className="text-red-500 text-sm mt-1">
                    {error.state}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-600 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={editingId ? handleUpdateAddress : handleAddAddress}
                className="px-4 py-2 bg-gray-800 text-white rounded-md"
              >
                {editingId ? "Update Address" : "Add Address"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
Address.propTypes = {
  selectedAddress: PropTypes.object,
  setSelectedAddress: PropTypes.func,
};
