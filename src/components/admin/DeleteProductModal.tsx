'use client';

import React from 'react';
import { X, Trash2, Package, DollarSign, Tag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: {
    url: string;
    public_id: string;
  };
}

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
}

export default function DeleteProductModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  product 
}: DeleteProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 modal-overlay backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl modal-shadow w-full max-w-md animate-scaleIn">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-800">Eliminar Producto</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              {product.image?.url ? (
                <img 
                  src={product.image.url} 
                  alt={product.name}
                  className="h-12 w-12 rounded object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                  <Package className="h-6 w-6 text-gray-600" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">{product.description.substring(0, 50)}...</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="flex items-center space-x-1">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-gray-600">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-gray-600">{product.stock} units</span>
              </div>
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4 text-purple-600" />
                <span className="text-gray-600 capitalize">
                  {product.category.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}