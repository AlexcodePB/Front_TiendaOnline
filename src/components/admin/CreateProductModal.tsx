'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Package, Image as ImageIcon, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import axiosInstance from '@/utils/axiosConfig';
import { useToastContext } from '@/contexts/ToastContext';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image: {
      url: string;
      public_id: string;
    };
  }) => void;
  categories: string[];
}

export default function CreateProductModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  categories 
}: CreateProductModalProps) {
  const toast = useToastContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: categories[0] || '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ url: string; public_id: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadedImage) {
      toast.error('Imagen no subida', 'Primero sube una imagen válida');
      return;
    }

    try {
      await onSubmit({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        image: uploadedImage
      });

      // Limpiar formulario al completar
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: categories[0] || '',
      });
      setSelectedFile(null);
      setImagePreview(null);
      setUploadedImage(null);
      setUploadError(null);
      toast.success('Producto creado', 'El producto se creó exitosamente con la imagen');
      
    } catch (error: any) {
      console.error('Error creating product:', error);
      const msg = error.response?.data?.error || 'Ocurrió un error al crear el producto';
      toast.error('Error al crear producto', msg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validación simple en cliente
  const priceNum = parseFloat(formData.price);
  const stockNum = parseInt(formData.stock, 10);
  const nameValid = formData.name.trim().length > 0;
  const descriptionValid = formData.description.trim().length >= 10;
  const priceValid = !isNaN(priceNum) && priceNum >= 0;
  const stockValid = Number.isInteger(stockNum) && stockNum >= 0;
  const categoryValid = typeof formData.category === 'string' && formData.category.trim().length > 0;
  const fieldsValid = nameValid && descriptionValid && priceValid && stockValid && categoryValid;
  const isCreateDisabled = uploading || !uploadedImage || !fieldsValid;

  const handleFileSelect = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('Archivo muy grande', `El archivo pesa ${(file.size / 1024 / 1024).toFixed(1)}MB. El tamaño máximo es 5MB`);
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast.info('Imagen cargada', `Archivo: ${file.name}`);

      // Subir inmediatamente a Cloudinary
      setUploading(true);
      setUploadError(null);
      setUploadedImage(null);
      try {
        const imageFormData = new FormData();
        imageFormData.append('image', file);

        const uploadResponse = await axiosInstance.post('/upload/image', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (!uploadResponse.data || !uploadResponse.data.url || !uploadResponse.data.public_id) {
          throw new Error('Respuesta inválida del servidor');
        }

        setUploadedImage({ url: uploadResponse.data.url, public_id: uploadResponse.data.public_id });
        toast.success('Imagen subida', 'La imagen se subió correctamente');
      } catch (error: any) {
        console.error('Error uploading image:', error);
        const msg =
          error.response?.data?.error ||
          (error.response?.status === 413
            ? 'La imagen excede el tamaño máximo (5MB)'
            : 'No se pudo subir la imagen. Intenta nuevamente.');
        setUploadError(msg);
        toast.error('Error al subir imagen', msg);
      } finally {
        setUploading(false);
      }
    } else {
      toast.error('Archivo inválido', 'Por favor selecciona un archivo de imagen válido (PNG, JPG, JPEG)');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    const cleanup = async () => {
      try {
        if (uploadedImage?.public_id) {
          const encoded = encodeURIComponent(uploadedImage.public_id);
          await axiosInstance.delete(`/upload/image/${encoded}`);
          toast.info('Imagen eliminada', 'Se eliminó de Cloudinary');
        }
      } catch (err) {
        console.warn('No se pudo eliminar la imagen temporal:', err);
      } finally {
        setSelectedFile(null);
        setImagePreview(null);
        setUploadedImage(null);
        setUploadError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    cleanup();
  };

  const replaceImage = async () => {
    // Eliminar imagen previamente subida y abrir selector
    try {
      if (uploadedImage?.public_id) {
        const encoded = encodeURIComponent(uploadedImage.public_id);
        await axiosInstance.delete(`/upload/image/${encoded}`);
      }
    } catch (err) {
      console.warn('No se pudo eliminar la imagen previa al reemplazo:', err);
    } finally {
      setSelectedFile(null);
      setImagePreview(null);
      setUploadedImage(null);
      setUploadError(null);
      fileInputRef.current?.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-overlay backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl modal-shadow w-full max-w-md animate-scaleIn">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-800">Crear Producto</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {!nameValid && (
              <p className="mt-1 text-xs text-red-600">El nombre es requerido.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {!descriptionValid && (
              <p className="mt-1 text-xs text-red-600">La descripción debe tener al menos 10 caracteres.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {!priceValid && (
                <p className="mt-1 text-xs text-red-600">El precio debe ser un número mayor o igual a 0.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {!stockValid && (
                <p className="mt-1 text-xs text-red-600">El stock debe ser un entero mayor o igual a 0.</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
            {!categoryValid && (
              <p className="mt-1 text-xs text-red-600">Selecciona una categoría válida.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen del Producto
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
                {/* Estado de subida */}
                <div className="mt-2">
                  {uploading && (
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      <Upload className="h-4 w-4 animate-pulse" /> Subiendo imagen...
                    </div>
                  )}
                  {!uploading && uploadedImage && (
                    <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Imagen subida
                      <div className="ml-auto text-xs text-green-700 truncate">
                        ID: {uploadedImage.public_id}
                      </div>
                    </div>
                  )}
                  {!uploading && uploadError && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> {uploadError}
                    </div>
                  )}
                </div>
                {/* Acciones sobre la imagen */}
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={replaceImage}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <RefreshCw className="h-4 w-4" /> Reemplazar imagen
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG hasta 5MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreateDisabled}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></div>
                  Subiendo...
                </>
              ) : (
                'Crear'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
