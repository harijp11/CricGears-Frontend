import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRight,
  Users,
  DollarSign,
  Package,
  ShoppingBag,
  IndianRupee,
} from "lucide-react";
import axiosInstance from "../../../AxiosInstance";
import { fetchAdminDashboardAPI } from "../../../services/adminService";

export function DashboardContent() {

  const [TotalCustomers, setTotalCustomers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [TotalProducts, setTotalProducts] = useState(0);
  const [salesChartData, setSalesChartData] = useState([]);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [bestSellingCategories, setBestSellingCategories] = useState([]);

  const [timeFilter, setTimeFilter] = useState("week");

  function Card({ title, value, icon, change }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-500">{title}</div>
        {React.createElement(icon, { className: "w-6 h-6 text-gray-400" })}
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="flex items-center text-sm">{change}</div>
    </div>
    );
  }

  async function fetchChartData(){
    try{
         const response = await fetchAdminDashboardAPI(timeFilter);
          
         setTotalCustomers(response.data.TotalCustomers || 0)
         setTotalSales(response.data.totalSales|| 0)
         setTotalOrders(response.data.totalOrders || 0)
         setTotalProducts(response.data.totalProducts)
         setSalesChartData(response.data.salesChart || [])
         setBestSellingProducts(response.data.bestProducts || [])
        setBestSellingCategories(response.data.bestCategory || [])
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    fetchChartData()
  },[timeFilter])


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card title="Total Customers" value={TotalCustomers} icon={Users} />
        <Card
          title="Total Sales"
          value={`₹ ${totalSales}`}
          icon={IndianRupee}
        />
        <Card title="Total Orders" value={totalOrders} icon={Package} />
        <Card
          title="Total Products"
          value={TotalProducts}
          icon={ShoppingBag}
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sales Overview</h2>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Best Selling Products and Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Best Selling Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestSellingProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="sales" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Best Selling Categories
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bestSellingCategories} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="sales" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
