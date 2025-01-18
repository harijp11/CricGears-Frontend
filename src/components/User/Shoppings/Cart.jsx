import React, { useEffect, useState } from "react";
import {
  Binary,
  ChevronRight,
  Delete,
  DeleteIcon,
  Minus,
  Plus,
  Recycle,
  ShoppingCart,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { toast } from "sonner";
import axiosInstance from "../../../AxiosInstance";
import { useSelector } from "react-redux";
// import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "../../ui/header";
import { CalculateOfferPrice } from "../../../util/CalculateOfferPrice";

export default function Cart() {
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user.userDatas);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtota] = useState(0);
  const [reload, setReload] = useState(false);

  const [catId,setCatId]=useState()
  const [productId,setProductId]= useState()

  const discount = 0;
  const deliveryFee = 0;
  const total = subtotal - discount + deliveryFee;

  async function fetchCartItems() {
    try {
      const response = await axiosInstance.get(
        `/user/fetchCart/${userData._id}`
      );   
      setCartItems(response.data.cartItems.items);
      setSubtota(response.data.cartItems.totalCartPrice);
    } catch (err) {
      console.log(err);
      if (err.response) {
        return toast.error(err.response.data.message);
      }
    }
  }

  useEffect(() => {
    fetchCartItems();
    setReload(false);
  }, [reload]);

  async function handlePlus(item){
    try{
        const response= await axiosInstance.patch(`/user/cart/plus/${item._id}/${userData._id}`)
        // console.log(response.data.message);
        setReload(true);
        if(response.data.success=== false){
            toast.info(response.data.message)
        }
    }catch(err){
        if (err.response) {
            // console.log(err.response.data.message);
          }
          console.log(err);
        }
    }

    async function handleMinus(item){
        try{
           const response= await axiosInstance.patch(`/user/cart/minus/${item._id}/${userData._id}`)
           setReload(true)
        //    toast.success(response.data.message)
        // console.log(response.data.message);
        
        }catch(err){
            console.log(err);
        }
    }

    async function handleRemove(item){
        try{
           const response= await axiosInstance.delete(`/user/cart/remove/${item._id}/${userData._id}`)
           setReload(true)
          //  console.log(response.data.message);
           return toast.warning(response.data.message);
        }catch(err){
            console.log(err);
        }
    }
  

  return (
    <>
    <SiteHeader/>
    <div className="min-h-screen bg-white text-black">
    <header>
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
      </div>
      <div className="container mx-auto px-4 mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-gray-600 hover:text-black">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">Cart</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
    <main className="container mx-auto px-4 py-8">
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any cricket bats to your cart yet.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition duration-300"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className={`flex flex-col sm:flex-row items-center gap-4 py-4 border-b border-gray-200 ${
                        item.qty === 0 ? "opacity-50" : ""
                      }`}
                    >
                      <div className="w-full sm:w-32 h-35 flex-shrink-0">
                          <img
                            src={item?.productId?.images[0]}
                            alt={item?.productId?.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                      <div className="sm:w-3/4 space-y-2">
                        <h3 className="text-lg font-semibold">{item.productId.name}</h3>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm font-medium">INR {item.salePrice.toFixed(2)}</p>
                        <p className="text-sm font-bold">Total: INR {item.totalProductPrice.toFixed(2)}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              onClick={() => handleMinus(item)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-1 text-center w-12">{item.qty}</span>
                            <button
                              onClick={() => handlePlus(item)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemove(item)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3">
            <div className="bg-white shadow-md rounded-lg overflow-hidden sticky top-4">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">INR {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold">INR {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  {subtotal ? (
                    <button
                      onClick={() => navigate("/checkout")}
                      className="w-full bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition duration-300 flex items-center justify-center"
                    >
                      <span>Go to Checkout</span>
                      <ChevronRight size={20} className="ml-2" />
                    </button>
                  ) : (
                    <div className="text-center">
                      <span className="block text-red-500 mb-4">
                        Current items in the cart are out of stock
                      </span>
                      <button
                        onClick={() => navigate("/shop")}
                        className="w-full bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition duration-300 flex items-center justify-center"
                      >
                        <span>Continue Shopping</span>
                        <ChevronRight size={20} className="ml-2" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  </div>
  </>
  );
}
