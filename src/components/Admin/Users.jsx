import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"

import {useNavigate} from "react-router-dom"
import axiosInstance from "../../AxiosInstance";

import { toast,Toaster } from "sonner";
// import { Input } from "../ui/Input";
import { FolderX, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/Slice/UserSlice";
import Pagination from "../shared/Pagination";
import ConfirmationModal from "../shared/confirmationModal";


export default function Users(){
    const [page, setPage] = useState(1);
  const limit = 5;
  const [totalPages, setTotalPages] = useState(0);
  const userData = useSelector((store) => store.user.userDatas);
  const navigate=useNavigate()
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    onConfirm: null,
  }); 

  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [toggle, setToggle] = useState(true);


  useEffect(()=>{
    const fetchUserData=async()=>{
    try{
        const response=await axiosInstance.get(`/admin/users?page=${page}=${limit}`)
        setTotalPages(response.data.totalPages) 
        setUsers(response.data.users)
    }catch(err){
         if(err.response && err.response.status===404){
            return toast.error(err.response.data.message)
         }
         console.log(err);
         toast.error("An error occurred. Please try again.")
      }
    }
    fetchUserData()
  },[page,toggle])
   
  const handleStatus=async(_id,isActive)=>{
     setModalContent({
        title:"Block User",
        message:`Are you sure you want to ${
            isActive ? "Block" : "Unblock"
        } this user?` ,
        onConfirm:async()=>{
            try{
               const response =await axiosInstance.put("/admin/users/block",{
                _id,
                isActive
               })
               const res=await axiosInstance.post('/user/logout')
              //  console.log(res);
               setToggle(!toggle)
               toast.success(response.data.message)
               dispatch(logoutUser())
            }catch(err){
                if (err.response && err.response.status === 404) {
                    return toast.error(err.response.data.message);
                  }
                  toast.error("An error occurred. Please try again.");
            }
        },
     })
     setIsOpen(true)
    }

    return (
      <>
    <Toaster position="top-right" richColors/>
        <div className="p-0 sm:p-8 bg-gray-50">
          <ConfirmationModal
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            title={modalContent.title}
            message={modalContent.message}
            onConfirm={modalContent.onConfirm}
          />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Consumers List</h1>
              <div>
              <button className="text-gray-500" onClick={()=>navigate("/admin/home")}>Home &gt;</button>
              <button className="text-gray-500" onClick={()=>navigate("/admin/Dashboard")}>Dashboard &gt;</button>
              <button className="text-gray-500" onClick={()=>navigate("")}>View Customers</button>

              </div>
              <br/>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {users.length != 0 && (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[100px]">Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50">
                      <TableCell className="py-6">
                        <div className="flex items-center justify-center">
                          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center shadow-inner">
                            <span className="text-3xl font-bold text-gray-700">
                              {user.name
                                ? user.name
                                    .split(" ")
                                    .map((name) => name[0].toUpperCase())
                                    .join("")
                                : ""}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone || "Not yet Added"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleStatus(user._id, user.isActive)}
                          variant={user.isActive ? "destructive" : "default"}
                          size="sm"
                        >
                          {user.isActive ? "Block" : "Unblock"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
    
            {users.length !== 0 && (
              <Pagination page={page} setPage={setPage} totalPages={totalPages} />
            )}
          </div>
          {users.length == 0 && (
            <div className="flex items-center justify-center h-[50vh]">
              <div className="text-center">
                <FolderX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h1 className="text-2xl font-semibold text-gray-900">
                  No Customers Yet
                </h1>
              </div>
            </div>
          )}
        </div>
        </>
      );
    }
    