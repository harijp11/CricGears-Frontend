import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Search, User, ShoppingCart, Menu, X, Heart, LogOut } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PopupBox } from "../ui/PopupBox";

export function SiteHeader() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user.userDatas);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {}, []);

  return (
    <nav className="text-black bg-white p-2 sm:p-4 z-[999] relative transition-all duration-300 drop-shadow-xl">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {userData && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 sm:mr-4 md:hidden"
              onClick={toggleMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="text-xl sm:text-2xl font-bold">CricGears</div>
        </div>
        <div className="hidden md:flex flex-grow justify-center">
          <div className="space-x-2 sm:space-x-4 lg:space-x-6">
            <PopupBox isOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
            <Link to="/shop" className="hover:text-gray-700">
              Shop
            </Link>
            <Link to="/contact" className="hover:text-gray-700">
              Contact
            </Link>
            <Link to="/about" className="hover:text-gray-700">
              About
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          {userData ? (
            <>
              <Button
                onClick={() => {
                  navigate("/wishlist");
                }}
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => {
                  navigate("/cart");
                }}
                variant="ghost"
                size="icon"
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <div
                onClick={() => {
                  navigate("/viewprofile");
                }}
                className="flex items-center cursor-pointer justify-center bg-gray-300 text-black rounded-full w-8 h-8 sm:w-10 sm:h-10 font-bold"
              >
                {userData.name.charAt(0).toUpperCase()}
                {userData.name.charAt(userData.name.length - 1).toUpperCase()}
              </div>
            </>
          ) : (
            <Button
              onClick={() => {
                navigate("/login");
              }}
              className="bg-black text-white text-sm sm:text-base px-2 sm:px-4 py-1 sm:py-2 hover:scale-105"
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[2000] transition-opacity duration-300"
          onClick={toggleMenu}
        >
          <div
            className={`fixed left-0 top-0 h-auto max-h-screen w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[3000] ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-white h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={toggleMenu}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="mt-8 flex flex-col space-y-4">
                {userData && (
                  <Button 
                    onClick={() => {setIsPopupOpen(true); setIsMenuOpen(false)}}
                    className="flex items-center justify-start space-x-2 bg-red-500 hover:bg-red-600 transition-colors duration-200 text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                )}
                <Link to="/" className="hover:text-gray-700">Home</Link>
                <Link to="/shop" className="hover:text-gray-700">Shop</Link>
                <Link to="/contact" className="hover:text-gray-700">Contact</Link>
                <Link to="/about" className="hover:text-gray-700">About</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

