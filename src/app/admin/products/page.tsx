'use client';

import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, Edit, Trash2, Eye, DollarSign, UserX } from 'lucide-react';
import { useToastContext } from '@/contexts/ToastContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import axiosInstance from '@/utils/axiosConfig';
import CreateProductModal from '@/components/admin/CreateProductModal';
import EditProductModal from '@/components/admin/EditProductModal';
import DeleteProductModal from '@/components/admin/DeleteProductModal';
import Pagination from '@/components/ui/Pagination';

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
  createdAt: string;
}

interface ApiResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const CATEGORIES = [
  'tables',
  'wheels', 
  'trucks',
  'bearings',
  'grip-tape',
  'hardware',
  'tools',
  'clothing',
  'accessories'
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const toast = useToastContext();
  const { isAuthorized, isLoading: authLoading } = useAuthGuard({ requireAdmin: true });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      });

      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory !== 'all') params.append('category', filterCategory);

      const response = await axiosInstance.get<ApiResponse>(
        `/products?${params}`
      );

      setProducts(response.data.products);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalItems || response.data.pagination.total || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error de conexión', 'No se pudieron cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchProducts();
    }
  }, [currentPage, searchTerm, filterCategory, itemsPerPage, isAuthorized]);

  const handleCreateProduct = async (productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image: {
      url: string;
      public_id: string;
    };
  }) => {
    try {
      const response = await axiosInstance.post('/products', productData);
      
      setShowCreateModal(false);
      fetchProducts();
      // No mostrar toast aquí porque ya se muestra en el modal
    } catch (error) {
      console.error('Error creating product:', error);
      throw error; // Re-lanzar para que el modal pueda manejarlo
    }
  };

  const handleEditProduct = async (productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image?: {
      url: string;
      public_id: string;
    };
  }) => {
    if (!selectedProduct) return;
    
    try {
      const response = await axiosInstance.put(`/products/${selectedProduct.id}`, productData);
      
      setShowEditModal(false);
      setSelectedProduct(null);
      fetchProducts();
      // No mostrar toast aquí porque ya se muestra en el modal
    } catch (error) {
      console.error('Error updating product:', error);
      throw error; // Re-lanzar para que el modal pueda manejarlo
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      await axiosInstance.delete(`/products/${selectedProduct.id}`);
      
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts();
      toast.success('Producto eliminado', 'El producto se eliminó exitosamente');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar producto', 'Ocurrió un error inesperado');
    }
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset a la primera página al cambiar items por página
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // El hook se encargará de la redirección
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Gestión de Productos</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Crear Producto
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-xl font-bold">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">In Stock</p>
              <p className="text-xl font-bold">{products.filter(p => p.stock > 0).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-xl font-bold">{products.filter(p => p.stock < 10).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Trash2 className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <p className="text-xl font-bold">{products.filter(p => p.stock === 0).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
          
          <div className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500">
            Status Filter (Coming Soon)
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12">
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
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                    {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.stock === 0 
                      ? 'bg-red-100 text-red-800' 
                      : product.stock < 10 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No products found matching your criteria.
          </div>
        )}
      </div>

      {/* Paginación Mejorada */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-md px-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            showItemsPerPage={true}
            showTotalItems={true}
          />
        </div>
      )}

      {/* Modals */}
      <CreateProductModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProduct}
        categories={CATEGORIES}
      />

      <EditProductModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEditProduct}
        product={selectedProduct}
        categories={CATEGORIES}
      />

      <DeleteProductModal 
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
        }}
        onConfirm={handleDeleteProduct}
        product={selectedProduct}
      />
    </div>
  );
}