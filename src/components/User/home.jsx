import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "../ui/header";
import { SiteFooter } from "../ui/footer";
import ProductCard from "../ui/ProductCard";
import { Star, Truck, Shield } from 'lucide-react';
import axiosInstance from "../../AxiosInstance";
import Homeimg from "../../assets/picsart_version-rGc4ycOkG-transformed.jpeg";
import { fetchProducts } from "../../services/productsService";

export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const response =  await fetchProducts();
        setProducts(response.data.productData);
      } catch (err) {
        console.error("Error fetching products:", err);

        if (err.response && err.response.status === 400) {
          // Assuming you have a toast library imported
          toast.error(err.response.data.message);
          return;
        }

        toast.error("An error occurred. Please try again.");
      }
    }
    fetchNewArrivals();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <main className="flex-1">
        <section
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${Homeimg})` }}
        >
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-[600px] bg-white/80 backdrop-blur-sm p-6 rounded-xl">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter">
                  Elevate Your Cricket Game
                </h1>
                <p className="max-w-[600px] text-sm sm:text-base md:text-lg lg:text-xl text-gray-700">
                  Discover premium cricket bats crafted for performance. From
                  beginners to pros, find your perfect match.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-6">
                <button
                  onClick={() => navigate("/shop")}
                  className="inline-flex items-center justify-center rounded-md text-sm 
                  font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-600/90 h-11 px-8 w-full sm:w-auto"
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center mb-8 sm:mb-12">
              Featured Bats
            </h2>
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-8xl mx-auto">
              {products.slice(0, 5).map((product) => (
                <div key={product._id} className="w-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            <div className="mt-8 sm:mt-12 text-center">
              <button
                onClick={() => navigate("/shop")}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-600/90 h-11 px-8"
              >
                View All Bats
              </button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center mb-8 sm:mb-12">
              Why Choose Us
            </h2>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  Icon: Star,
                  title: "Quality Assured",
                  description: "All bats meet professional standards",
                },
                {
                  Icon: Truck,
                  title: "Fast Shipping",
                  description:
                    "Get your gear quickly with our expedited shipping",
                },
                {
                  Icon: Shield,
                  title: "Secure Payments",
                  description:
                    "Shop with confidence using our secure payment system",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <feature.Icon className="w-12 h-12 mb-4 text-blue-600" />
                  <h3 className="font-bold text-lg sm:text-xl mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

