'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Edit, Save, X } from 'lucide-react';
import { useToastContext } from '@/contexts/ToastContext';

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToastContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        reset({ name: user?.name, phone: user?.phone });
      }
    }
  }, [isLoading, isAuthenticated, user, router, reset]);

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      setIsUpdating(true);
      setServerError(null);
      await updateUser(data);
      setIsEditing(false);
      toast.success('Perfil actualizado', 'Los cambios se guardaron exitosamente');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Error al actualizar el perfil.';
      setServerError(errorMessage);
      toast.error('Error al actualizar perfil', errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {serverError && <p className="text-sm text-red-500">{serverError}</p>}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input {...register('name')} id="name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-800 focus:border-gray-800" />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input {...register('phone')} id="phone" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-800 focus:border-gray-800" />
              {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  reset({ name: user?.name, phone: user?.phone });
                }}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex items-center">
              <User className="w-5 h-5 text-gray-400 mr-4" />
              <div>
                <p className="text-xs text-gray-500">Nombre</p>
                <p className="text-gray-800 font-medium">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-4" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-gray-800 font-medium">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-5 h-5 text-gray-400 mr-4" />
              <div>
                <p className="text-xs text-gray-500">Teléfono</p>
                <p className="text-gray-800 font-medium">{user?.phone || 'No especificado'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
