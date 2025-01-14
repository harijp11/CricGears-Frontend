import React, { useEffect, useState } from "react";
import { SiteHeader } from "../ui/header";
import { SiteFooter } from "../ui/footer";
import ProductCard from "../ui/ProductCard";
import { Card } from "../ui/card";
import { Star, Truck, Shield } from "lucide-react";
import axiosInstance from "../../AxiosInstance";
import Homeimg from "../../assets/picsart_version-rGc4ycOkG-transformed.jpeg";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        const response = await axiosInstance.get("/user/fetchProducts", {});
        setProducts(response.data.productData);
      } catch (err) {
        console.error("Error fetching products:", err);

        if (err.response && err.response.status === 400) {
          return toast.error(err.response.data.message);
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
          className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${Homeimg})` }}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-[600px] bg-white/80 backdrop-blur-sm p-6 rounded-xl">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Elevate Your Cricket Game
                </h1>
                <p className="max-w-[600px] text-gray-700 md:text-xl">
                  Discover premium cricket bats crafted for performance. From
                  beginners to pros, find your perfect match.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
                <button
                  onClick={() => navigate("/shop")}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-600/90 h-11 px-8"
                >
                  Shop Now
                </button>
                {/* <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-input bg-white hover:bg-gray-100 h-11 px-8">
                  Learn More
                </button> */}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Featured Bats
            </h2>
            <div className="grid gap-7 sm:grid-cols-1 lg:grid-cols-5 max-w-8xl">
              {products.slice(0, 5).map((product, index) => (
                <div className="max-w-sm">
                  <ProductCard key={product._id} product={product} />
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <button
                onClick={() => navigate("/shop")}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-600/90 h-11 px-8"
              >
                View All Bats
              </button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Why Choose Us
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
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
