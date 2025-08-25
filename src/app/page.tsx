'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/contexts/AuthContext';
import { productsApi } from '@/services/api';
import { Product } from '@/types';

export default function Home() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productsApi.getAll({ limit: 8 }); // Fetch first 8 products
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat min-h-[60vh] md:min-h-[70vh] flex items-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('https://res.cloudinary.com/dxkbeygys/image/upload/v1756074128/Hero_fqtkex.jpg')"
        }}
      >
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight">
                  <span className="block drop-shadow-2xl">DOMINA</span>
                  <span className="block drop-shadow-2xl text-orange-400">LA CALLE</span>
                </h1>
                <p className="text-xl md:text-2xl lg:text-3xl mb-10 text-gray-100 max-w-3xl mx-auto leading-relaxed drop-shadow-lg font-medium">
                  Equipamiento Pro para tu próximo truco.<br />
                  <span className="text-orange-200">Calidad que se siente en cada giro.</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button className="bg-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-orange-400">
                    VER EQUIPAMIENTO
                  </button>
                  <button className="bg-white/10 backdrop-blur-sm text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30 hover:border-white/50">
                    EXPLORAR MARCAS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Section Title */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Lo Más Nuevo
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Nuestra selección de material recién llegado.
          </p>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-200 h-48 w-full animate-pulse"></div>
                <div className="bg-gray-200 h-6 w-3/4 mt-4 animate-pulse"></div>
                <div className="bg-gray-200 h-8 w-1/4 mt-2 animate-pulse"></div>
              </div>
            ))
          ) : (
            products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                className="transform hover:scale-105 transition-transform duration-200 animate-fade-in"
              />
            ))
          )}
        </div>
      </main>
    </>
  );
}
