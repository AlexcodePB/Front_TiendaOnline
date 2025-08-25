'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useToastContext } from '@/contexts/ToastContext';
import { CheckCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart } = useCart();
  const toast = useToastContext();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = async () => {
    try {
      setAdding(true);
      await addToCart({ productId: product.id, quantity: 1 });
      toast.success('Carrito', 'Producto agregado');
      setJustAdded(true);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'No se pudo agregar al carrito';
      toast.error('Error', msg);
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => setJustAdded(false), 1200);
    return () => clearTimeout(t);
  }, [justAdded]);

  return (
    <div className={`max-w-sm p-6 bg-white rounded-3xl shadow-lg ${className}`}>
      <div className="mb-6 relative">
        {/* Stock badge */}
        <div className="absolute left-2 top-2 z-10">
          {product.stock === 0 ? (
            <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 font-medium">Sin stock</span>
          ) : product.stock < 10 ? (
            <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium">Pocas unidades</span>
          ) : (
            <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium">En stock</span>
          )}
        </div>
        <Link href={`/product/${product.id}`}>
          <img
            className="w-full h-56 object-contain rounded-2xl"
            src={product.image.url}
            alt={`Imagen de ${product.name}`}
          />
        </Link>
      </div>
      <div>
        <Link href={`/product/${product.id}`} className="hover:underline">
          <h3 className="text-3xl font-bold">{product.name}</h3>
        </Link>
        <p className="text-base text-gray-500 my-4 line-clamp-2">{product.description}</p>
        <p className="text-3xl font-bold mb-6">${product.price.toFixed(2)}</p>
        <button
          onClick={handleAdd}
          disabled={adding || product.stock === 0}
          className={`w-full flex items-center justify-center py-3 font-semibold rounded-xl transition-colors disabled:opacity-50 ${
            justAdded ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {adding ? (
            <span className="mr-2">Añadiendo...</span>
          ) : justAdded ? (
            <>
              <CheckCircle className="mr-2 h-6 w-6" /> Agregado
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Agregar al carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
