import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import {toast,Toaster} from "sonner"



//USER
//user protectedroute
import ProtectedRoute from "./protected/userLoginProtect";
import UserProtectedRoute from "./protected/userProtectedRoute";

//user
import SignupPage from './pages/SignupPage';
import { Login } from "./components/User/login"; 

//about and contact
import AboutPage from "./pages/Aboutpage";
import ContactPage from "./pages/Contactpage";

//forgot paasword and reset password
import ForgotPassword from "./components/User/Forgotpassword";
import ResetPassword from "./components/User/ResetPassword";


//home shop product
import Home from "./pages/Homepage"
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";

//user detatils
import MyProfile from "./pages/Myprofile";

//changepassword
import ChangePassword from "./components/User/profile/Changepassword";

//CART
import Cart from "./components/User/Shoppings/Cart";

//checkout
import Checkout from "./components/User/Shoppings/Checkout";

//ordercomponent
import OrdersComponent from "./components/User/profile/OrderComponents";
import ViewOrderDetails from "./components/User/profile/viewOrderDetails";

//coupon
import userCouponList from "./components/User/profile/Coupons";
import Wishlist from "./components/User/profile/Wishlist";
import Wallet from "./components/User/profile/Wallet";



//ADMIN

//admin protected routes
import AdminProtectedRoute from "./protected/adminProtectedRoute";
import AdminLoginProtectedRoute from "./protected/adminLoginProtected";

//admin
import AdminLoginpage from "./pages/Admin/AdminLoginpage";
import Adminhome from "./pages/Admin/AdminHome";
import { AdminDashboard } from "./pages/Admin/AdminDashboard";

import Users from "./components/Admin/Users"

import AddCategory from "./components/Admin/Category/AddCategory";
import Category from "./components/Admin/Category/ViewCategory";
import EditCategory from "./components/Admin/Category/EditCategory"


import AddProduct from "./components/Admin/Product/AddProduct";
import ProductList from "./components/Admin/Product/Viewproducts";


//ORDERS

import AdminOrdersComponent from "./components/Admin/Order/Vieworders";
import ViewOrderDetailsAdmin from "./components/Admin/Order/VieworderDtails";

//offers
import AddCategoryOffer from "./components/Admin/offer/AddCategoryOffer";
import AddProductOffer from "./components/Admin/offer/AddProductOffer";

//coupon
import AddCoupon from "./components/Admin/coupon/Addcoupon";
import CouponList from "./components/Admin/coupon/Coupon";

//Salesreport
import SalesReport from "./components/Admin/SalesReport";

//Dashboard
// import { DashboardContent } from "./components/Admin/dashboard/Dashboard";

//404
import NotFound from './pages/PageNotefound'




function App() {
  return (
    <Router>
         <Toaster position="top-right" richColors/>
      <Routes>
        {/*User routes*/}

        {/* About and Contact*/}
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/contact" element={<ContactPage/>}/>

        {/* Protected routes */}
        <Route path="/signup" element={<ProtectedRoute element={SignupPage} />} />
        <Route path="/login" element={<ProtectedRoute element={Login} />} />
        <Route path="/" element={<Home />}/>
        <Route path="/viewprofile" element={<UserProtectedRoute element={MyProfile}/>}/>

        {/*change password*/}
        <Route path="/changepassword"element={<UserProtectedRoute element={ChangePassword}/>}/>

        {/*forgot password Routes */}
        <Route path="/forgotpassword" element={<ForgotPassword/>}/>
        <Route path="/resetpassword/:id" element={<ResetPassword/>}/>

        {/*AddressRoutes*/}
        {/* <Route path="/address" element={<Address/>}/> */}
        
        {/*shoproute*/}
        <Route path="/shop" element={<ShopPage/>}/>
          <Route path="/product/:id"  element={<ProductPage/>}/>

        {/*Cart routes*/}
        <Route path="/cart"element={<UserProtectedRoute element={Cart}/>}/>

        {/*checkout*/}
        <Route path="/checkout" element={<UserProtectedRoute element={Checkout}/>}/>

        {/*orders*/}
        <Route path="/vieworders" element={<UserProtectedRoute element={OrdersComponent}/>}/>
        <Route path="/vieworderdetails/:id" element={<ViewOrderDetails/>}/>

        {/*coupons*/}
        <Route path="/viewcoupons" element={<UserProtectedRoute element={userCouponList}/>}/>

        {/*Wishlist*/}
        <Route path="/wishlist" element={<UserProtectedRoute element={Wishlist}/>}/>
        {/*Wallet */}
        <Route path="/wallet" element={<UserProtectedRoute element={Wallet}/>}/>


        {/* ADMIN routes*/}
        <Route path="/admin/login" element={<AdminLoginProtectedRoute element={AdminLoginpage} />} />
         <Route path="/admin/home" element={<Adminhome/>}/>
         <Route path="/admin/Dashboard" element={<AdminProtectedRoute element={AdminDashboard} />} />

         {/* admin userRoute*/}
         <Route path="/admin/users" element={<AdminProtectedRoute element={Users} />} />

         {/*admin categoryroutes*/}
         <Route path="/admin/addCategory" element={<AdminProtectedRoute element={AddCategory} />} />
        <Route path="/admin/viewcategory" element={<AdminProtectedRoute element={Category} />} />
        <Route path="/admin/editCategory/:id" element={<AdminProtectedRoute element={EditCategory} />} />

        {/*admin productRoutes*/}
        <Route path="/admin/addProduct" element={<AdminProtectedRoute element={AddProduct} />} />
        <Route path="/admin/viewproducts" element={<AdminProtectedRoute element={ProductList} />} />
        {/*admin orderroutes*/}
        <Route path="/admin/vieworders"       element={<AdminProtectedRoute element={AdminOrdersComponent}/>}/>
        <Route path="/admin/viewdetails/:id" element={<AdminProtectedRoute element={ViewOrderDetailsAdmin}/>}/>
        <Route path="/admin/addcategoryoffer/:id/:categoryName"  element={<AdminProtectedRoute element={AddCategoryOffer}/>}/>
        <Route path="/admin/addproductoffer/:id/:productName" element={<AdminProtectedRoute element={AddProductOffer} />} />

        {/*admin coupon routes*/}
        <Route path="/admin/addcoupon" element={<AdminProtectedRoute element={AddCoupon} />} />
        <Route path="/admin/viewcoupons" element={<AdminProtectedRoute element={CouponList} />} />

        {/*admin sales Report*/}
        <Route path="/admin/salesreport" element={<AdminProtectedRoute element={SalesReport} />} />

        {/*admin Dashboard*/}
      

         {/* 404 - Page Not Found route */}
        <Route path="*" element={<NotFound />} />  {/* This will handle all unmatched routes */}
        
      </Routes>
    </Router>
  );
}

export default App;
