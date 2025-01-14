import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {Input} from "../../ui/Input"
import { Textarea } from "../../ui/textarea";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../AxiosInstance";
import { toast,Toaster } from "sonner";
import { validateCategory } from "../../../util/editCategoryValidation";


export default function EditCategory() {
    const { id } = useParams();
    const [existingCategory, setExistingCategory] = useState({});
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState({});

  
    useEffect(()=>{
        async function fetchCategoryData(){
            try{
                const response = await axiosInstance.get(`/admin/getCategory/${id}`);
                const {name,description}=response.data.categoryData
                setExistingCategory(response.data.categoryData)
                setName(name)
                setDescription(description)
            }catch(err){
                if (err.response && err.response.status === 404) {
                    return toast.error(err.response.data.message);
                  }
                  toast.error("An error occurred. Please try again.");
            }
        }
        fetchCategoryData()
    },[id])

    async function handleEditCategory(e){
      const validationResult = await validateCategory(name, description, id);
        
      // Set errors if validation fails
      if (!validationResult.isValid) {
          setError(validationResult.errors);
          return;
      }
            try{
                const response = await axiosInstance.put("/admin/editCategory",{
                    id,
                    name,
                    description,
                })
                toast.success(response.data.message)
               setTimeout(() => {
                navigate("/admin/viewcategory")
               },2000); 
            }catch(err){
                if (err.response && err.response.status === 400) {
                    toast.error(err.response.data.message);
                  } else {
                    toast.error("An error occurred. Please try again.");
                  }
            }
        
    }

    return (
      <>
    <Toaster position="top-right" richColors/>
        <div className='p-8 bg-white'>
          <h1 className='text-2xl font-semibold mb-2'>Edit Category</h1>
    
          {/* Breadcrumb */}
          <div>
              <button className="text-gray-500" onClick={()=>navigate("/admin/home")}>Home &gt;</button>
              <button className="text-gray-500" onClick={()=>navigate("/admin/Dashboard")}>Dashboard &gt;</button>
              <button className="text-gray-500" onClick={()=>navigate("/admin/viewcategory")}>View Categories &gt;</button>
              <button className="text-gray-500" >Edit Categories </button>
              </div>
              <br/>
    
          <div className='max-w-2xl'>
            <h2 className='text-lg font-medium mb-4'>General Information</h2>
    
            <div className='mb-4'>
              <label
                htmlFor='categoryName'
                className='block text-sm font-medium text-gray-700 mb-1'>
                Category Name
              </label>
              <Input
                id='categoryName'
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder='Type category name here...'
                className='w-full'
                value={name} // Use value instead of defaultValue
              />
              <span className='text-red-700  mt-10 ms-2'>
                {error && error.name}
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
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                placeholder='Type category description here...'
                className='w-full h-32'
                value={description} // Use value instead of defaultValue
              />
              <span className='text-red-700  mt-10 ms-2'>
                {error && error.description}
              </span>
            </div>
    
            <div className='flex justify-end space-x-4'>
              <Button
                onClick={() => {
                  navigate("/admin/viewcategory");
                }}
                variant='outline'>
                Cancel
              </Button>
    
              <Button
                onClick={handleEditCategory}
                className='bg-black text-white hover:bg-gray-800'>
                Update Category
              </Button>
            </div>
          </div>
        </div>
        </>
      );
    }
    