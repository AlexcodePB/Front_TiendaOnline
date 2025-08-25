'use client';

import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-center px-6">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
        />
      </div>
    </header>
  );
}
