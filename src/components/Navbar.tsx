'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { productsApi } from '@/services/api';
import { ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { stats } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [popCart, setPopCart] = useState(false);
  const lastCountRef = useRef<number>(stats?.totalItems ?? 0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productsApi.getCategories();
        setCategories(response.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Pop animation when cart count increases
  useEffect(() => {
    const current = stats?.totalItems ?? 0;
    const prev = lastCountRef.current;
    if (current > prev) {
      setPopCart(true);
      const t = setTimeout(() => setPopCart(false), 350);
      return () => clearTimeout(t);
    }
    lastCountRef.current = current;
  }, [stats?.totalItems]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const formatCategoryName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">GRIND</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium capitalize"
              >
                {formatCategoryName(category)}
              </Link>
            ))}
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="text-gray-700 hover:text-gray-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            
            {isAuthenticated ? (
              <>
                <Link href="/cart" className="relative text-gray-700 hover:text-gray-900 transition-colors">
                  <ShoppingCart className={`w-5 h-5 transform-gpu transition-transform duration-300 ${popCart ? 'scale-125' : ''}`} />
                  {stats && stats.totalItems > 0 && (
                    <span
                      className={`absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium transform transition-all duration-300 ${
                        popCart ? 'bg-green-600 animate-pulse scale-110' : 'bg-orange-500'
                      }`}
                    >
                      {stats.totalItems}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="text-gray-700 hover:text-gray-900 transition-colors flex items-center"
                  >
                    <User className="w-5 h-5" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 z-20 animate-in fade-in-0 zoom-in-95 duration-200 origin-top-right">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3 text-gray-400" />
                          Mi Perfil
                        </Link>
                        {user?.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Panel Admin
                          </Link>
                        )}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/cart" className="text-gray-700 hover:text-gray-900 transition-colors">
                  <ShoppingCart className={`w-5 h-5 transform-gpu transition-transform duration-300 ${popCart ? 'scale-125' : ''}`} />
                </Link>
                <Link href="/login" className="text-gray-700 hover:text-gray-900 transition-colors">
                  <User className="w-5 h-5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-gray-700 hover:text-gray-900 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 border-t border-gray-200",
          isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0 border-t-0"
        )}>
          <div className="flex flex-col space-y-1 pt-4">
            {/* Navigation Links */}
            {categories.map((category) => (
              <Link
                key={category}
                href={`/category/${category.toLowerCase()}`}
                className="text-gray-700 hover:text-gray-900 py-2 px-2 rounded transition-colors font-medium capitalize"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {formatCategoryName(category)}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <Link 
                    href={user?.role === 'admin' ? '/admin' : '/profile'} 
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 py-2 px-2 rounded transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>{user?.name}</span>
                  </Link>
                  
                  <Link 
                    href="/cart" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 py-2 px-2 rounded transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart className={`w-5 h-5 transform-gpu transition-transform duration-300 ${popCart ? 'scale-125' : ''}`} />
                    <span className="flex items-center gap-2">
                      <span>Carrito</span>
                      {stats && stats.totalItems > 0 && (
                        <span
                          className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs rounded-full text-white transform transition-all duration-300 ${
                            popCart ? 'bg-green-600 animate-pulse scale-110' : 'bg-orange-500'
                          }`}
                        >
                          {stats.totalItems}
                        </span>
                      )}
                    </span>
                  </Link>

                  {user?.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="text-gray-700 hover:text-gray-900 py-2 px-2 rounded transition-colors block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 py-2 px-2 rounded transition-colors text-left w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-gray-900 py-2 px-2 rounded transition-colors block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-center block mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
