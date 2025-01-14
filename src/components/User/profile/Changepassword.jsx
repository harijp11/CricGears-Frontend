import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/Input";
import { AlertCircle, Eye, EyeOff,ArrowLeft } from "lucide-react";
import ConfirmationModal from "../../shared/confirmationModal";
import axiosInstance from "../../../AxiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validatePassword } from "../../../util/ChangepasswordValidation";

export default function ChangePassword() {
  const userData = useSelector((store) => store.user.userDatas);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Add state for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const { isValid, errors: validationErrors } = validatePassword(
    //   newPassword,
    //   confirmPassword,
    // );
    // if (!isValid) {
    //   setErrors(validationErrors);
    //   return;
    // }

    setModalContent({
      title: "Change Password",
      message: "Are you sure you want to Change to this new password?",
      onConfirm: async () => {
        try {
          const _Id = userData._id;
          const response = await axiosInstance.post("/user/changePassword", {
            currentPassword,
            newPassword,
            confirmPassword,
            _Id,
          });
          resetform();
          toast.success(response.data.message);
          setTimeout(() => navigate("/viewprofile"), 1500);
        } catch (err) {
          console.log(err);
          if (err.response) {
            toast.error(err.response.data.message);
          }
        }
      },
    });
    setIsOpen(true);
  };

  const resetform = () => {
    setCurrentPassword("");
    setConfirmPassword("");
    setNewPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
   <div class="fixed left-3 top-3">
          <button
            onClick={() => navigate("/viewprofile")}
            className="absolute left-0 top-0 flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          </div>
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={modalContent.title}
        message={modalContent.message}
        onConfirm={modalContent.onConfirm}
      />
      <div className="max-w-md w-full space-y-8">
        
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Change Password
          </h2>
        </div>
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle
                className="h-5 w-5 text-yellow-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Attention needed
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                Choose a strong password to keep your account secure!
                </p>
              </div>
            </div>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="current-password" className="sr-only">
                Current Password
              </label>
              <Input
                id="current-password"
                name="current-password"
                type={showCurrentPassword ? "text" : "password"}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="new-password" className="sr-only">
                New Password
              </label>
              <Input
                id="new-password"
                name="new-password"
                type={showNewPassword ? "text" : "password"}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    newPassword: "",
                  }));
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>
            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">
                Confirm New Password
              </label>
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "",
                  }));
                }}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}