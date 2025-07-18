import React, { useEffect, useState, useRef } from "react";
import { Heart, Minus, Plus, Slash, Star, X, Package } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/Caard";
import "../../App.css";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { CalculateOfferPrice } from "../../util/CalculateOfferPrice";
import { addToWishListApi,
  checkIsExistOnWishlistApi,
  removeFromWishListApi
 } from "../../services/wishlistApi";
import { addToCart } from "../../services/cartService";
import { getProductSizeForUser } from "../../services/productsService";

export default function ProductDetails({ product }) {
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const userData = useSelector((store) => store.user.userDatas);

  //offer
  const [offerPrice, setofferPrice] = useState(0);
  const [offerDiscountAmount, setofferDiscountAmount] = useState(null);
  const [offerDiscountPercentage, setofferDiscountPercentage] = useState(null);

  const [size, setSize] = useState(null);
  const [error, setError] = useState("");
  const [exist, setExist] = useState(false);
  const [existOnWishlist, setExistOnWishlist] = useState(false);

  function closeZoomModal() {
    setIsZoomModalOpen(false);
  }

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  async function test() {
    try{
    const offerData = await CalculateOfferPrice({
      product_id: product._id,
      category_id: product.category,
      product_price:product.price,
      product_saleprice:product.salePrice,
  })
    // console.log("productiddddddd",product._id);
    
     setofferPrice( offerData.offerPrice)
     setofferDiscountAmount(offerData.offerDiscountAmt)
     setofferDiscountPercentage(offerData.offerDiscount)
    //  console.log("offerDATA",offerData)
}catch(err){
  console.log("error",err)
}
  }

 

  async function handleSelectSize(s) {
    try {
      if (!userData) {
        return toast.warning("you should Login first to add item to cart");
      }
      setSize(s);
      setError("");
      const response = await getProductSizeForUser(product._id, userData._id, s.size);
      setExist(response.data.success);
      toast.success(response.data.message);
    } catch (err) {
      console.log(err);
    }
  }

  async function addToWishlist(){
    try{
      const product_id = product._id
      const user_id = userData._id

      const response = await addToWishListApi(product_id,user_id)
      toast.success(response.data.message);
      setExistOnWishlist(true);
    } catch (err) {
      console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  }

async function removeFromWishlist(){
  try{
    const product_id = product._id
    const user_id = userData._id

    const response = await removeFromWishListApi(product_id,user_id)
    toast.success(response.data.message);
    setExistOnWishlist(false);
  }catch(err){
    console.log(err);
      if (err.response) {
        toast.error(err.response.data.message);
      }
  }
}  

async function checkisExistInWishlist(){
  try{
    const product_id = product._id;
      const user_id = userData._id;
      const response = await checkIsExistOnWishlistApi(product_id,user_id)
      if (response.data.success) {
        setExistOnWishlist(true);
      } else {
        setExistOnWishlist(false);
      }
    } catch (err) {
      console.log(err);
    }
  }


  async function handleAddCart() {
    if (!size) {
      setError("Please select a size");
    } else {
      try {
        const stock = product.sizes.find((s) => s.size === size.size);
        console.log("stock", stock);

        const productData = {
          productId: product._id,
          price: product.price,
          salePrice: product.salePrice,
          size: size.size,
          stock: stock.stock,
          salesPrice: product.salesPrice,
          discountValue:offerDiscountPercentage,
          discountedAmount:offerPrice,
          qty: 1,
        };
        const response = addToCart(userData._id, productData);
        setExist(true);
        if (response && response.data && response.data.message) {
          toast.success(response.data.message);
        }
      } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message);
        }
      }
    }
  }

  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
    test()
    checkisExistInWishlist()
  }, [product]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 class="text-4xl sm:text-4xl lg:text-5xl font-bold text-gray-800 tracking-wide  mb-6">
        SHOP
      </h1>
      <div>
        <button className="text-gray-500" onClick={() => navigate("/shop")}>
          Shop &gt;
        </button>
        <button className="text-gray-500" onClick={() => navigate("")}>
          {product.name}{" "}
        </button>
      </div>
      <br />
      {/* <AnimatePresence>
        {isZoomModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeZoomModal}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="relative max-w-[30vw] max-h-[100vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:text-gray-200 z-10"
                onClick={closeZoomModal}
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={mainImage}
                alt="Zoomed product view"
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="scrollbar h-full order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[800px] md:min-w-[140px]">
            {product.images.map((img, index) => (
              <button
                key={index}
                className="flex-shrink-0 w-20 h-28 md:w-full md:h-52 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => setMainImage(img)}
              >
                <img
                  src={img}
                  alt={`Product view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <div className="order-1 md:order-2 flex-grow relative group ">
            <div
              ref={imageRef}
              className="relative overflow-hidden rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsZoomModalOpen(true)}
            >
              <div
                className="relative w-full h-auto  overflow-hidden bg-white"
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <img
                  src={mainImage}
                  alt="Product Main View"
                  className="w-full h-auto object-cover aspect-[3/4] transition-transform duration-300 ease-out"
                  style={{
                    transform: isHovering
                      ? `scale(2) translate(${-zoomPosition.x / 2}%, ${
                          -zoomPosition.y / 2
                        }%)`
                      : "scale(1)",
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    transition: "transform 0.3s ease-out",
                  }}
                />
                {isHovering && (
                  <div
                    className="absolute inset-0 pointer-events-none border-2 border-blue-500  opacity-20 bg-white"
                    style={{
                      boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                      left: `${zoomPosition.x}%`,
                      top: `${zoomPosition.y}%`,
                      transform: "translate(-50%, -50%)",
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <Card className="p-6">
          <CardContent className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-xl font-semibold">*Strong And Good Quality Woods</p>

            {offerPrice ? (
              <p className="text-lg font-semibold text-gray-500 line-through">
                {product.price.toFixed(2)} Rs
              </p>
            ) : (
              <p className="text-lg font-semibold text-gray-500 line-through">
                {product.salePrice.toFixed(2)} Rs
              </p>
            )}

             <div>
              <p className="text-4xl font-bold text-black">
                {offerPrice
                  ? `${offerPrice.toFixed(2)} Rs`
                  : `${product.price.toFixed(2)} Rs`}
              </p>
              {offerDiscountPercentage && (
                <p className="text-lg font-normal text-red-500">
                  {offerDiscountPercentage.toFixed(2)}% Off
                </p>
              )}
            </div>

            <p className="text-gray-600">{product.description}</p>

            <div>
              {product.totalStock <= 15 && product.totalStock >= 1 && (
                <h6 className="mt-5 text-red-500">
                  Total Stock Left: {product.totalStock}
                </h6>
              )}
              {product.totalStock === 0 && (
                <h6 className="mt-5 text-red-500">Out of Stock</h6>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Size</h3>
              <div className="flex space-x-2">
                {product.sizes.map((s) => {
                  if (s.stock > 0) {
                    return (
                      <Button
                        onClick={() => handleSelectSize(s)}
                        key={s.size}
                        className={`w-10 h-10 ${
                          size === s
                            ? "bg-black text-white"
                            : "bg-gray-200 text-black hover:bg-gray-300"
                        }`}
                      >
                        {s.size}
                      </Button>
                    );
                  }
                  return (
                    <div key={s.size} className="relative">
                      <Button
                        disabled
                        className="w-10 h-10 bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        {s.size}
                      </Button>
                      <Slash className="absolute top-0 left-0 w-full h-full text-red-200" />
                    </div>
                  );
                })}
              </div>
              {product.totalStock <= 15 && product.totalStock >= 1 && (
                <h6 className="mt-5 text-red-500">
                  Total Stock Left: {product.totalStock}
                </h6>
              )}
              {product.totalStock === 0 && (
                <h6 className="mt-5 text-red-500">Out of Stock</h6>
              )}
            </div>

            <div>
              {error && <span className="text-red-500">{error}</span>}
              <div className="flex items-center space-x-4">
                {exist ? (
                  <Button
                    onClick={() => {
                      navigate("/cart");
                    }}
                       className="flex-1 bg-black text-white w-auto p-2 rounded"
                  >
                    Go to Cart
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddCart}
                    className="flex-1 bg-black text-white w-auto p-2 rounded"
                  >
                    Add to Cart
                  </Button>
                )}
                {existOnWishlist ? (
                  <Button
                    onClick={removeFromWishlist}
                    variant="outline"
                    size="icon"
                  >
                    <Heart className="h-4 w-4" fill="red" />
                  </Button>
                ) : (
                  <Button onClick={addToWishlist} variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

ProductDetails.propTypes = {
  product: PropTypes.object.isRequired,
};
