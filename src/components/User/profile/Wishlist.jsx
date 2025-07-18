import {
  checkisExistonCart,
  fetchWishlistApi,
  moveItemtoCartApi,
  removeFromWishListApi,
} from "../../../services/wishlistApi";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../ui/breadcrumb";
import { SiteHeader } from "../../ui/header";
import { SiteFooter } from "../../ui/footer";

import axiosInstance from "../../../AxiosInstance";
import ConfirmationModalwithButtons from "../../shared/ConfirmationModalwithButtons";
import { remove } from "lodash";
import React, { useEffect, useState,useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addToCart } from "../../../services/cartService";

export default function Wishlist() {
  const userData = useSelector((store) => store.user.userDatas);
  const [wishlist, setWishlist] = useState([]);
  const [reload, setReload] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [removeId, setRemoveId] = useState();
  const navigate = useNavigate();
  const selectRefs = useRef({});

  const removeFromWishlist = async (id) => {
    try {
      const response = await removeFromWishListApi(id, userData._id);
      setReload(true);
      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  const moveToCart = async (product) => {
    try {
      const productSize = selectedSizes[product._id];
      if (!productSize || !productSize.size) {
        toast.error("Select a size before moving to cart");
        return;
      }

      const productData = {
        productId: product._id,
        price: product.price,
        salePrice: product.salePrice,
        size: productSize.size,
        stock: productSize.stock,
        qty: 1,
      };

      const res = await checkisExistonCart(product._id, selectedSizes);
      if (res.data.success) {
        setRemoveId(product._id);
        return setIsOpen(true);
      }

      const response = await addToCart(userData._id,
       productData);
        removeFromWishlist(product._id);
      if (selectRefs.current[product._id]) {
        selectRefs.current[product._id].value = "";
      }
      setReload(true);
      toast.success(response.data.message);
      setSelectedSizes((prev) => ({ ...prev, [product._id]: {} }));
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };

  async function fetchWishlist() {
    try {
      const user_id = userData._id;
      const response = await fetchWishlistApi(user_id);
      const activeProducts = response?.data?.wishlist?.items.filter(
        item => item.productId && item.productId.isActive === true
      );
      setWishlist(activeProducts);
    } catch (err) {
      console.log(err);
    }
  }

  const handleConfirm = () => {
    navigate("/cart");
  };

  const handleCancel = () => {
    removeFromWishlist(removeId);
  };

  useEffect(() => {
    fetchWishlist();
    setReload(false);
  }, [reload]);

  return (
    <>
      <SiteHeader />
      <div className="container w-screen h-screen mx-auto px-4 py-8 bg-white text-black">
      <header>
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
      </div>
      <div className="container mx-auto px-4 mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-gray-600 hover:text-black">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-gray-400" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900">wishlist</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col sm:flex-row"
            >
              <div className="w-full sm:w-1/3">
                <img
                  src={item.productId.images[0]}
                  alt={item.productId.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full sm:w-2/3 p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    {item.productId.name}
                  </h2>
                  <p className="text-gray-500 line-through mb-2">
                    Rs. {item.productId.price.toFixed(2)}
                  </p>
                  <p className="text-black font-bold">
                    Rs. {item.productId.salePrice.toFixed(2)}
                  </p>
                  <div className="flex items-center mb-4">
                    <label
                      htmlFor={`size-${item.id}`}
                      className="mr-2 text-gray-700"
                    >
                      Size:
                    </label>
                    <select
                      ref={(el) => selectRefs.current[item.productId._id] = el} 
                      id={`size-${item.id}`}
                      className="border border-gray-300 rounded px-2 py-1 text-gray-700 bg-white"
                      onChange={(e) => {
                        const selectedSize = e.target.value;
                        const selectedSizeData = item.productId.sizes.find(
                          (s) => s.size === selectedSize
                        );

                        setSelectedSizes((prev) => ({
                          ...prev,
                          [item.productId._id]: {
                            size: selectedSize,
                            stock: selectedSizeData
                              ? selectedSizeData.stock
                              : 0,
                          },
                        }));
                      }}
                    >
                      <option value="" disabled selected>
                        Select a size
                      </option>
                      {item.productId.sizes.map((s) => (
                        <option key={s._id} value={s.size}>
                          {s.size}
                        </option>
                      ))}
                    </select>
                    {selectedSizes[item.productId._id]?.stock === 0 && (
                      <span className="ml-2 text-red-500">Out of Stock</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-auto">
                  <button
                    onClick={() => {
                      if (selectedSizes[item.productId._id]?.stock > 0) {
                        moveToCart(item.productId);
                      }
                    }}
                    disabled={selectedSizes[item.productId._id]?.stock === 0}
                    className={`bg-black text-white font-bold py-2 px-4 rounded transition-all duration-300 
                  ${
                   selectedSizes[item.productId._id]?.stock === 0
                   ? "bg-gray-400 cursor-not-allowed opacity-50"
                   : "hover:bg-gray-800 hover:scale-[1.05]"
                  }`}
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.productId._id)}
                    className="bg-white hover:bg-gray-100 text-black font-bold py-2 px-4 rounded border border-black transition-all duration-300 hover:scale-[1.05] "
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {wishlist.length === 0 && (
          <p className="text-center text-gray-600 mt-8">
            Your wishlist is empty.
          </p>
        )}
        <ConfirmationModalwithButtons
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          title="On cart?"
          message="This Product is already in the cart.Do you want to go to the cart"
          confirmText="Go to Cart"
          cancelText="Remove Item"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
      <SiteFooter />
    </>
  );
}
