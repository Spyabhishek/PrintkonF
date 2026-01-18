import React, { useEffect, useState } from "react";
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  Package, 
  Calendar, 
  Eye, 
  ArrowRight, 
  TrendingUp, 
  User,
  ShoppingBag,
  Heart,
  Settings,
  Bell,
  Search,
  Star,
  CreditCard,
  Truck,
  Gift,
  Grid3X3,
  Filter
} from "lucide-react";

// ProfileCard Component
const ProfileCard = ({ user, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center gap-3 bg-white/60 rounded-full px-4 py-2 animate-pulse">
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        <div className="space-y-1">
          <div className="w-20 h-3 bg-gray-300 rounded"></div>
          <div className="w-16 h-2 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-white/60 rounded-full px-4 py-2">
      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
        <User className="w-4 h-4 text-white" />
      </div>
      <div className="text-sm">
        <div className="font-medium text-gray-900">{user?.name || 'Guest'}</div>
        <div className="text-gray-500">Premium Member</div>
      </div>
    </div>
  );
};