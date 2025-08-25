'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Users, Package, LogOut, Home as HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Products', href: '/admin/products', icon: Package },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-700">
        <h1 className="text-xl font-bold tracking-wider">GRID</h1>
      </div>
      <nav className="flex-grow px-2 py-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center px-4 py-2.5 my-1 rounded-lg transition-colors duration-200',
                  pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto p-4 border-t border-gray-700">
        {/* User Card */}
        <div className="bg-gray-700/50 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Link
          href="/"
          className="flex items-center px-4 py-2.5 my-1 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
        >
          <HomeIcon className="h-5 w-5 mr-3" />
          <span>Volver al Sitio</span>
        </Link>
        <button
          onClick={() => logout()}
          className="w-full flex items-center px-4 py-2.5 my-1 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
