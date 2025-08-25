'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { productsApi } from '@/services/api';
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProductsByCategory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await productsApi.getByCategory(slug);
        setProducts(response.data);
      } catch (err) {
        setError('No se pudieron cargar los productos para esta categoría.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [slug]);

  const categoryName = slug ? slug.replace('-', ' ') : 'Categoría';

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 capitalize mb-8">
          {categoryName}
        </h1>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="bg-gray-200 h-48 w-full animate-pulse"></div>
                <div className="bg-gray-200 h-6 w-3/4 mt-4 animate-pulse"></div>
                <div className="bg-gray-200 h-8 w-1/4 mt-2 animate-pulse"></div>
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && !error && products.length === 0 && (
          <p>No hay productos en esta categoría.</p>
        )}

        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
