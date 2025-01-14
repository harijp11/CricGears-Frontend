import React from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import {   
  Dialog,   
  DialogContent,   
  DialogDescription,   
  DialogFooter,   
  DialogHeader,   
  DialogTitle, 
} from "../ui/dialog";  
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/Slice/UserSlice";  
import { logoutAdmin } from "../../redux/Slice/AdminSlice";
import axiosInstance from "../../AxiosInstance";

export function PopupBox({isOpen, setIsPopupOpen}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const adminData=useSelector((store)=>store.admin.adminDatas)

 async function handleLogout() {
    try{
      if(adminData){
          const response =await axiosInstance.post('/admin/logout')
          console.log(response);
          dispatch(logoutAdmin())
          navigate("/admin/login")
          setIsPopupOpen(false)
      }else{
    const response=await axiosInstance.post('/user/logout')
    
    console.log(response);
    
    dispatch(logoutUser());

    navigate("/login");

    setIsPopupOpen(false);
      }
    }catch (error) {
        console.error('Logout failed', error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsPopupOpen} >
    <DialogContent className="sm:max-w-[425px] rounded-lg bg-white">
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-2xl font-semibold">Log Out</DialogTitle>
        <DialogDescription className="text-gray-500">
          Are you sure you want to log out?
        </DialogDescription>
        <button
          onClick={() => setIsPopupOpen(false)}
          className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          {/* <X className="h-4 w-4" /> */}
          <span className="sr-only">Close</span>
        </button>
      </DialogHeader>
      
      <DialogFooter className="mt-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setIsPopupOpen(false)} className="px-4 py-2 bg-black text-white hover:bg-gray-200 focus:ring-gray-500 border border-gray-300">
          Cancel
        </Button>
        <Button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 focus:ring-red-500">
          Logout
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
  
  );
}