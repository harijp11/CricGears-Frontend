import React from 'react';
import { SiteAdminHeader } from '../ui/adminHeader';
import { SiteFooter } from '../ui/footer';
import { Card } from '../ui/card';
import { Star, Truck, Shield, Package, Users, DollarSign } from 'lucide-react';
import Homeimg from '../../assets/picsart_version-rGc4ycOkG-transformed.jpeg';

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteAdminHeader />
      <main className="flex-1">
        <section 
          className="w-full h-screen py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${Homeimg})` }}
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-[600px] bg-white/80 backdrop-blur-sm p-6 rounded-xl">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Admin
                </h1>
                <p className="max-w-[600px] text-gray-700 md:text-xl">
                  Manage your cricket equipment store with ease. Monitor sales, inventory, and customer activity.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
               
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Store Overview</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Package, title: "Total Products", value: "150", change: "+5 this week" },
                { icon: Users, title: "Active Customers", value: "1,234", change: "+12% this month" },
                { icon: DollarSign, title: "Revenue", value: "$25,678", change: "+8% vs last month" },
              ].map((stat, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center space-x-4">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-lg">{stat.title}</h3>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.change}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-12 text-center">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-600/90 h-11 px-8">
                View Detailed Reports
              </button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Quick Actions</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { Icon: Package, title: "Manage Inventory", description: "Update stock levels and product details" },
                { Icon: Users, title: "Customer Management", description: "View and manage customer accounts" },
                { Icon: DollarSign, title: "Sales Reports", description: "Generate and analyze sales data" },
              ].map((action, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <action.Icon className="w-12 h-12 mb-4 text-blue-600" />
                  <h3 className="font-bold text-xl mb-2">{action.title}</h3>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-blue-600 text-white hover:bg-blue-600/90 h-9 px-4">
                    Go to {action.title}
                  </button>
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

