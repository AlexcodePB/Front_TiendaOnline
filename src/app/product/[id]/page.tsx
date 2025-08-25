'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productsApi } from '@/services/api';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useToastContext } from '@/contexts/ToastContext';
import Link from 'next/link';
import { Minus, Plus, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { addToCart } = useCart();
  const toast = useToastContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const p = await productsApi.getById(id);
        if (!mounted) return;
        setProduct(p);
        setQty(1);
      } catch (err) {
        setError('No se pudo cargar el producto.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
    return () => {
      mounted = false;
    };
  }, [id]);

  const decrease = () => setQty((q) => Math.max(1, q - 1));
  const increase = () => setQty((q) => Math.min(q + 1, product?.stock ?? q + 1));

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      setAdding(true);
      await addToCart({ productId: product.id, quantity: qty });
      toast.success('Carrito', 'Producto agregado');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'No se pudo agregar al carrito';
      toast.error('Error', msg);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600">{error || 'Producto no encontrado'}</p>
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 mt-4 text-gray-700 hover:text-black">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6">
        <ArrowLeft className="w-4 h-4" /> Volver a la tienda
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-4">
          <img
            src={product.image.url}
            alt={product.name}
            className="w-full h-[420px] object-contain rounded"
          />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-gray-600 capitalize">{product.category.replace('-', ' ')}</p>
          <p className="mt-4 text-3xl font-bold">${product.price.toFixed(2)}</p>
          <p className="mt-4 text-gray-700 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <p className="text-sm text-gray-600">
              Stock: {product.stock > 0 ? (
                <span className="text-green-600 font-medium">Disponible</span>
              ) : (
                <span className="text-red-600 font-medium">Sin stock</span>
              )}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button onClick={decrease} className="p-2 rounded-md border hover:bg-gray-50" aria-label="Disminuir">
                <Minus className="w-4 h-4" />
              </button>
              <span className="min-w-[2rem] text-center">{qty}</span>
              <button onClick={increase} className="p-2 rounded-md border hover:bg-gray-50" aria-label="Aumentar">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {adding ? 'Agregando...' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

