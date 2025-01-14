import axiosInstance from "../AxiosInstance";
import {SiteFooter} from "../components/ui/footer";
import {SiteHeader} from "../components/ui/header";
import ProductCardContainer from "../components/ui/ProductContainer";
import AdditionalProductInfo from "../components/User/AdditionalProductInfo";
import ProductDetails from "../components/User/ProductDetails";
// import UserReviews from "@/components/User/UserReviews";
import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { toast } from "sonner";

function ProductPage(){
    const [products, setProducts] = useState([]);
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    const [loading, setLoading] = useState(true); // Loading state
    const navigate = useNavigate(); 


    useEffect(()=>{
        const fetchProduct = async () => {
            setLoading(true)
            try {
             
                const response = await axiosInstance.post(`/user/fetcheProduct`,{id});
                
                if (!response.data.success) {
                  toast.warning("This product is no longer available");
                  navigate('/shop');
                  return;
              }
                   
                setProduct(response.data.product)

               
                
                const res = await axiosInstance.post("/user/products/related", {
                    categoryId: response.data.product.category,
                  });

                  const relatedProducts = res.data.productData.filter((X)=>
                X._id !==response.data.product._id)
                  setProducts(relatedProducts);
            }catch(err){
                if (err.response && err.response.status === 401) {
                    toast.error(err.response.data.message);
                  } else {
                    toast.error("An error occurred. Please try again.");
                  }
                } finally {
                  setLoading(false); // End loading
            }
        }
        fetchProduct();
    },[id])
    //  console.log("productpage==>",products);

    return (
        <>
          <SiteHeader />
          {loading ? ( // Show loading state
            <div className="h-screen w-full flex items-center justify-center bg-gray-100">
            <p className="text-xl text-center">Loading...</p>
          </div>
          ) : product ? (
            <>
              <ProductDetails
                product={product}
              />
              <AdditionalProductInfo
                product={product}
              />
             
              {product && <ProductCardContainer products={products}  />
            }
           
            </>
          ) : (
            <div className="h-screen w-full flex items-center justify-center bg-gray-100">
            <p className="text-xl text-center">No product found</p>
          </div>
          )}
          {/* <span>{product.isActive}</span> */}
          <SiteFooter />
        </>
      );
    }
    
    export default ProductPage;
    