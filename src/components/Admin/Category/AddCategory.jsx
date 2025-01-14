import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/Input";
import { Textarea } from "../../ui/textarea";
import { ChevronRight } from "lucide-react";
import { toast,Toaster } from "sonner";
import axiosInstance from "../../../AxiosInstance";
import { useNavigate } from "react-router-dom";
import {validateCategory} from "../../../util/categoryValidation"


export default function AddCategory(){
    const [cname,setCname] = useState("");
    const [description,setDescription] = useState("")
    const navigate = useNavigate()
    const [error,setError] = useState({})


    async function Addcategory(e){
          e.preventDefault()
          const validationResult = await validateCategory(cname, description);
    
          // Set errors if validation fails
          if (!validationResult.isValid) {
            setError(validationResult.errors);
            return;
          }
         
         try {
            const response = await axiosInstance.post("/admin/addCategories", {
              name: cname,
              description,
            });
            toast.success(response.data.message)
           setTimeout(() => {
            navigate("/admin/viewcategory"); 
           },1500); 

           

         } catch (err) {
             if (err.response && err.response.status === 404) {
               return toast.error(err.response.data.message);
             }
             toast.error("An error occurred. Please try again.");
            
         }
     
  }



  return(
    <>
    <Toaster position="top-right" richColors/>
    <div className='p-8 bg-white'>
    <h1 className='text-2xl font-semibold mb-2'>Add Category</h1>

    {/* Breadcrumb */}
    <nav className='flex mb-6 text-sm text-gray-500'>
    <div>
              <button className="text-gray-500" onClick={()=>navigate("/admin/home")}>Home &gt;</button>
              <button className="text-gray-500" onClick={()=>navigate("/admin/Dashboard")}>Dashboard &gt;</button>
              <button className="text-gray-500" onClick={()=>navigate("/admin/viewcategory")}>View Category &gt;</button>
              <button className="text-gray-500" onClick={()=>navigate("/admin/addCategory")}>Add category</button>
              </div>
              <br/>
    </nav>
    

    <div className='max-w-2xl'>
      <h2 className='text-lg font-medium mb-4'>General Information</h2>

      <form onSubmit={Addcategory}>
        <div className='mb-4'>
          <label
            htmlFor='categoryName'
            className='block text-sm font-medium text-gray-700 mb-1'>
            Category Name
          </label>
          <Input
            id='categoryName'
            placeholder='Type category name here...'
            className='w-full'
            onChange={(e) => {
              setCname(e.target.value);
              setError((prev) => ({ ...prev,cname: "" }))
            }}
          />
          <span className='text-red-700  mt-10 ms-2'>
            {error && error.cname}
          </span>
        </div>

        <div className='mb-6'>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700 mb-1'>
            Description
          </label>
          <Textarea
            id='description'
            placeholder='Type category description here...'
            className='w-full h-32'
            onChange={(e) => {
              setDescription(e.target.value);
              setError((prev) => ({ ...prev, description: "" }))
            }}
          />
          <span className='text-red-700  mt-10 ms-2'>
            {error && error.description}
          </span>
        </div>

        <div className='flex justify-end space-x-4'>
          <Button variant='outline' onClick={()=>navigate("/admin/viewcategory")}>cancel</Button>
          <Button className='bg-black text-white hover:bg-gray-800'>
            Add Category
          </Button>
        </div>
      </form>
    </div>
  </div>
  </>
  )
}
