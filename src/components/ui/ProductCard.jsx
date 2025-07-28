import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [stars, setStars] = useState(0);
  const {
    _id,
    name,
    price,
    salePrice,
    discountedAmount,
    rating,
    category,
    isActive,
    images,
    totalStock,
  } = product;

  // Calculate the current price
  const hasDiscount = discountedAmount && discountedAmount > 0;
  const currentPrice = hasDiscount ? price - discountedAmount : price;
  // Set stars based on rating (assuming rating is a number, e.g., 4.5)
  useEffect(() => {
    if (rating) {
      setStars(Math.round(rating));
    }
  }, [rating]);

  return (
    <div
      onClick={() => {
        navigate(`/product/${_id}`);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }}
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer"
    >
      <div className="relative aspect-w-3 aspect-h-4">
        <img
          src={images[0]}
          alt={name}
          className="object-cover w-full h-full"
        />
        {totalStock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            Out of Stock
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 truncate">{name}</h3>
        <div className="flex justify-between items-center mb-2">
          <p className="font-bold text-lg text-primary">
            Rs.{currentPrice.toFixed(2)}
          </p>
          {hasDiscount && (
            <p className="text-sm text-gray-500">
              <del>Rs.{price.toFixed(2)}</del>
            </p>
          )}
        </div>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < stars ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-1">({rating || 0})</span>
        </div>
        <div className="text-sm text-gray-600">
          <span>{category?.name || "Unknown Category"}</span>
          {/* Remove isActive as it's not user-facing */}
        </div>
      </div>
    </div>
  );
}