import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { orderService } from "../../../shared/services/orderService";
import OrderHistory from "../../../features/orders/components/OrderHistory";
import {
  Package,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
  User,
  Settings,
  ShoppingCart,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    inProgress: 0,
    cancelled: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orders = await orderService.getMyOrders();
      setOrders(orders);
      calculateStats(orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (orders) => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o =>
        ['PENDING_PAYMENT', 'UNDER_REVIEW', 'PROCESSING'].includes(o.status)
      ).length,
      inProgress: orders.filter(o =>
        ['APPROVED', 'IN_PRODUCTION'].includes(o.status)
      ).length,
      completed: orders.filter(o =>
        ['COMPLETED', 'DELIVERED'].includes(o.status)
      ).length,
      cancelled: orders.filter(o =>
        ['CANCELLED', 'REJECTED'].includes(o.status)
      ).length
    };
    setStats(stats);
  };

  const StatCard = ({ title, value, description, icon: Icon, color, trend }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-l-4 ${color} shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{value}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className={`p-3 rounded-xl ${color.replace('border-', 'bg-').replace('-600', '-50 dark:bg-gray-700')}`}>
          <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-3">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600 dark:text-green-400">{trend}</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-2xl"></div>
              ))}
            </div>

            <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Here's what's happening with your orders today.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <Link
                to="/user/profile"
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                to="/user/settings"
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Action Card */}
          <Link
            to="/user/place-order"
            className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-6 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Quick Action</p>
                <h2 className="text-2xl font-bold">Place New Order</h2>
              </div>
              <div className="p-2 bg-white/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Plus className="w-6 h-6" />
              </div>
            </div>
            <p className="text-blue-100 text-sm opacity-90">
              Start a new project with us in just a few clicks
            </p>
          </Link>

          {/* Stats Cards */}
          <StatCard
            title="Total Orders"
            value={stats.total}
            description="All time orders"
            icon={Package}
            color="border-blue-600"
          />

          <StatCard
            title="In Progress"
            value={stats.inProgress}
            description="Being processed"
            icon={Clock}
            color="border-yellow-600"
          />

          <StatCard
            title="Completed"
            value={stats.completed}
            description="Successfully delivered"
            icon={CheckCircle}
            color="border-green-600"
          />
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recent Orders
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {orders.length > 0
                    ? `You have ${stats.pending} pending orders needing attention`
                    : 'No orders yet'
                  }
                </p>
              </div>

              {orders.length > 0 && (
                <Link
                  to="/user/orders"
                  className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 mt-4 sm:mt-0"
                >
                  <span className="font-medium">View All Orders</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* OrderHistory Component */}
          <div className="p-6">
            <OrderHistory
              embedded={true}
              maxItems={5}
              showHeader={false}
              showBackButton={false}
              showCreateOrderButton={true}
              onOrderUpdate={fetchOrders}
            />
          </div>
        </div>

        {/* Quick Links Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Track Order', icon: Package, href: '/user/orders' },
            { label: 'Support', icon: AlertCircle, href: '/support' },
            { label: 'FAQ', icon: User, href: '/faq' },
            { label: 'Settings', icon: Settings, href: '/user/settings' }
          ].map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-200 group"
            >
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}