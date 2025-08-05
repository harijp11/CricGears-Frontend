import React, { Suspense, useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {toast,Toaster} from "sonner"
import { CricketLoader } from "./components/ui/customLoading";


const ProtectedRoute = React.lazy(() => import("./protected/userLoginProtect"))
const UserProtectedRoute = React.lazy(() => import("./protected/userProtectedRoute"))
const SignupPage = React.lazy(() => import("./pages/SignupPage"))
const Login = React.lazy(() => import("./components/User/login").then((module) => ({ default: module.Login })))
const AboutPage = React.lazy(() => import("./pages/Aboutpage"))
const ContactPage = React.lazy(() => import("./pages/Contactpage"))
const ForgotPassword = React.lazy(() => import("./components/User/Forgotpassword"))
const ResetPassword = React.lazy(() => import("./components/User/ResetPassword"))
const Home = React.lazy(() => import("./pages/Homepage"))
const ShopPage = React.lazy(() => import("./pages/ShopPage"))
const ProductPage = React.lazy(() => import("./pages/ProductPage"))
const MyProfile = React.lazy(() => import("./pages/Myprofile"))
const ChangePassword = React.lazy(() => import("./components/User/profile/Changepassword"))
const Cart = React.lazy(() => import("./components/User/Shoppings/Cart"))
const Checkout = React.lazy(() => import("./components/User/Shoppings/Checkout"))
const OrdersComponent = React.lazy(() => import("./components/User/profile/OrderComponents"))
const ViewOrderDetails = React.lazy(() => import("./components/User/profile/viewOrderDetails"))
const userCouponList = React.lazy(() => import("./components/User/profile/Coupons"))
const Wishlist = React.lazy(() => import("./components/User/profile/Wishlist"))
const Wallet = React.lazy(() => import("./components/User/profile/Wallet"))

// ADMIN
const AdminProtectedRoute = React.lazy(() => import("./protected/adminProtectedRoute"))
const AdminLoginProtectedRoute = React.lazy(() => import("./protected/adminLoginProtected"))
const AdminLoginpage = React.lazy(() => import("./pages/Admin/AdminLoginpage"))
const Adminhome = React.lazy(() => import("./pages/Admin/AdminHome"))
const AdminDashboard = React.lazy(() =>
  import("./pages/Admin/AdminDashboard"),
)
const Users = React.lazy(() => import("./pages/Admin/AdminUserManagement"))
const Category = React.lazy(() => import("./pages/Admin/AdminCategoryManagement"))
const ProductList = React.lazy(() => import("./pages/Admin/AdminProductsManagement"))
const CouponList = React.lazy(() => import("./pages/Admin/AdminCouponManagement"))
const AdminOrdersComponent = React.lazy(() => import("./pages/Admin/AdminOrderManagement"))
const SalesReport = React.lazy(() => import("./pages/Admin/AdminSalesManagement"))


const AddCategory = React.lazy(() => import("./components/Admin/Category/AddCategory"))
const EditCategory = React.lazy(() => import("./components/Admin/Category/EditCategory"))
const AddProduct = React.lazy(() => import("./components/Admin/Product/AddProduct"))
const EditProduct = React.lazy(()=>import("./components/Admin/Product/EditProduct"))





const ViewOrderDetailsAdmin = React.lazy(() => import("./components/Admin/Order/VieworderDtails"))
const AddCategoryOffer = React.lazy(() => import("./components/Admin/offer/AddCategoryOffer"))
const AddProductOffer = React.lazy(() => import("./components/Admin/offer/AddProductOffer"))
const AddCoupon = React.lazy(() => import("./components/Admin/coupon/Addcoupon"))
const UpdateCoupon = React.lazy(()=>import("./components/Admin/coupon/EditCoupon"))


const NotFound = React.lazy(() => import("./pages/PageNotefound"))

function App() {
   const [delayOver, setDelayOver] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelayOver(true)
    }, 6000) // 👈 3 seconds minimum delay
    return () => clearTimeout(timer)
  }, [])

  if (!delayOver) {
    return <CricketLoader /> // 👈 Show loader initially
  }
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Suspense fallback={<CricketLoader />}>
        <Routes>
          {/*User routes*/}
          {/* About and Contact*/}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          {/* Protected routes */}
          <Route path="/signup" element={<ProtectedRoute element={SignupPage} />} />
          <Route path="/login" element={<ProtectedRoute element={Login} />} />
          <Route path="/" element={<Home />} />
          <Route path="/viewprofile" element={<UserProtectedRoute element={MyProfile} />} />
          {/*change password*/}
          <Route path="/changepassword" element={<UserProtectedRoute element={ChangePassword} />} />
          {/*forgot password Routes */}
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:id" element={<ResetPassword />} />
          {/*AddressRoutes*/}
          {/* <Route path="/address" element={<Address/>}/> */}
          {/*shoproute*/}
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          {/*Cart routes*/}
          <Route path="/cart" element={<UserProtectedRoute element={Cart} />} />
          {/*checkout*/}
          <Route path="/checkout" element={<UserProtectedRoute element={Checkout} />} />
          {/*orders*/}
          <Route path="/vieworders" element={<UserProtectedRoute element={OrdersComponent} />} />
          <Route path="/vieworderdetails/:id" element={<ViewOrderDetails />} />
          {/*coupons*/}
          <Route path="/viewcoupons" element={<UserProtectedRoute element={userCouponList} />} />
          {/*Wishlist*/}
          <Route path="/wishlist" element={<UserProtectedRoute element={Wishlist} />} />
          {/*Wallet */}
          <Route path="/wallet" element={<UserProtectedRoute element={Wallet} />} />


          {/* ADMIN routes*/}
          <Route path="/admin/login" element={<AdminLoginProtectedRoute element={AdminLoginpage} />} />
          <Route path="/admin/home" element={<Adminhome />} />
          <Route path="/admin/Dashboard" element={<AdminProtectedRoute element={AdminDashboard} />} />
          {/* admin userRoute*/}
          <Route path="/admin/users" element={<AdminProtectedRoute element={Users} />} />
          {/*admin categoryroutes*/}
          <Route path="/admin/addCategory" element={<AdminProtectedRoute element={AddCategory} />} />
          <Route path="/admin/viewcategory" element={<AdminProtectedRoute element={Category} />} />
          <Route path="/admin/editCategory/:id" element={<AdminProtectedRoute element={EditCategory} />} />
          {/*admin productRoutes*/}
          <Route path="/admin/addProduct" element={<AdminProtectedRoute element={AddProduct} />} />
           <Route path="/admin/editProduct/:productId" element={<AdminProtectedRoute element={EditProduct} />} />
          <Route path="/admin/viewproducts" element={<AdminProtectedRoute element={ProductList} />} />
          {/*admin orderroutes*/}
          <Route path="/admin/vieworders" element={<AdminProtectedRoute element={AdminOrdersComponent} />} />
          
          <Route path="/admin/viewdetails/:id" element={<AdminProtectedRoute element={ViewOrderDetailsAdmin} />} />
          <Route
            path="/admin/addcategoryoffer/:id/:categoryName"
            element={<AdminProtectedRoute element={AddCategoryOffer} />}
          />
          <Route
            path="/admin/addproductoffer/:id/:productName"
            element={<AdminProtectedRoute element={AddProductOffer} />}
          />
          {/*admin coupon routes*/}
          <Route path="/admin/addcoupon" element={<AdminProtectedRoute element={AddCoupon} />} />
          <Route path="/admin/editcoupon/:couponId" element={<AdminProtectedRoute element={UpdateCoupon} />} />
          <Route path="/admin/viewcoupons" element={<AdminProtectedRoute element={CouponList} />} />
          {/*admin sales Report*/}
          <Route path="/admin/salesreport" element={<AdminProtectedRoute element={SalesReport} />} />
          {/*admin Dashboard*/}
          {/* 404 - Page Not Found route */}
          <Route path="*" element={<NotFound />} /> {/* This will handle all unmatched routes */}
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App