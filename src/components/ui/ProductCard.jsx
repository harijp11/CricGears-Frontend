import React, { useEffect, useState } from "react";
import { Star } from 'lucide-react';
import { useNavigate } from "react-router-dom";
// import axiosInstance from "@/AxiosConfig";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [stars, setStars] = useState(0);
  const {
    name,
    price,
    salePrice,
    rating,
    category,
    isActive,
    images,
    totalStock,
  } = product;

  return (
    <div
      onClick={() => {
        navigate(`/product/${product._id}`);
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
          <p className="font-bold text-lg text-primary">Rs.{salePrice.toFixed(2)}</p>
          <p className="text-sm text-gray-500"><del>Rs.{price}</del></p>
        </div>
        <div className="flex items-center mb-2">
          {[...Array(stars)].map((_, index) => (
            <Star
              key={index}
              className="w-4 h-4 text-yellow-400 fill-current"
            />
          ))}
          <span className="text-yellow-400 ml-1 text-sm">
            ★★★★★
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <span>{category?.name}</span>
          <span>{isActive}</span>
        </div>
      </div> 
    </div>
  );
}

