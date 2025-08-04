import React,{useState} from 'react';
import { Home, User, Package, List, X, LayoutDashboard, ClipboardList, Settings,LogOut,Tag,Ticket,BarChart2} from 'lucide-react';
import { Link } from 'react-router-dom';
import {PopupBox} from "../../ui/PopupBox";
// const adminData = useSelector((store) =>store.admin.adminDatas);


export function Sidebar({ isOpen, onClose }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <aside className={`bg-gray-800 text-white w-64 min-h-screen p-4 fixed left-0 top-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out z-30`}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white md:hidden">
        <X className="h-6 w-6" />
      </button>
      <nav>
        <div className="mb-8">
          <Link to="#" className="flex items-center mb-4 text-xl font-bold">
            <LayoutDashboard className="h-6 w-6 mr-2" />
            <span>Admin Dashboard</span>
          </Link>
        </div>
        <ul className="space-y-2">
        <li>
            <Link to="/admin/home" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <Home className="h-4 w-4 mr-2" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <User className="h-4 w-4 mr-2" />
              <span>View Customers</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/viewcategory" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <List className="h-4 w-4 mr-2" />
              <span>View Categories</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/viewproducts" className="flex items-center p-2 hover:bg-gray-700 rounded">
              <Package className="h-4 w-4 mr-2" />
              <span>View Products</span>
            </Link>
          </li>
          <li>
          <Link to="/admin/viewcoupons" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <Ticket className="h-4 w-4 mr-2" />
            <span>View Coupons</span>
          </Link>
        </li>
          <li>
          <Link to="/admin/vieworders" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <ClipboardList className="h-4 w-4 mr-2" />
            <span>View Orders</span>
          </Link>
        </li>
        <li>
          <Link to="/admin/salesreport" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <BarChart2 className="h-4 w-4 mr-2" />
            <span>Sales Report</span>
          </Link>
        </li>
        {/* <li>
          <Link href="/admin/settings" className="flex items-center p-2 hover:bg-gray-700 rounded">
            <Settings className="h-4 w-4 mr-2" />
            <span>Settings</span>
          </Link>
        </li> */}
        <li>
          <Link href="" className="flex items-center p-2 hover:bg-gray-700 rounded" onClick={()=>setIsPopupOpen(true)}>
            <LogOut className="h-4 w-4 mr-2" />
            <span>Logout</span>
          </Link>
        </li>
        </ul>
        <PopupBox isOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} />
      </nav>
    </aside>
  );
}

