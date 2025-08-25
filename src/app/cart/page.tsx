'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToastContext } from '@/contexts/ToastContext';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function CartPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const toast = useToastContext();
  const {
    cart,
    stats,
    isLoading,
    error,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    checkAvailability,
  } = useCart();

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [localQty, setLocalQty] = useState<Record<string, number>>({});
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{
    available: boolean;
    unavailableItems: Array<{
      itemId: string;
      productId: string;
      productName?: string;
      requestedQuantity?: number;
      availableStock?: number;
      reason: string;
    }>;
    totalItems: number;
  } | null>(null);

  // Sincronizar cantidades locales cuando cambia el carrito
  useEffect(() => {
    const map: Record<string, number> = {};
    cart?.items.forEach((it) => {
      map[it.productId.id] = it.quantity;
    });
    setLocalQty(map);
  }, [cart]);

  const isEmpty = useMemo(() => !cart || cart.items.length === 0, [cart]);

  const handleDecrease = async (productId: string, currentQty: number) => {
    try {
      setUpdatingId(productId);
      const nextQty = Math.max(currentQty - 1, 0); // 0 elimina el item
      await updateCartItem({ productId, quantity: nextQty });
      await fetchCart();
      if (nextQty === 0) toast.info('Carrito', 'Producto eliminado');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'No se pudo actualizar el producto';
      toast.error('Error al actualizar', msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleIncrease = async (productId: string, currentQty: number) => {
    try {
      setUpdatingId(productId);
      await updateCartItem({ productId, quantity: currentQty + 1 });
      await fetchCart();
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'No se pudo actualizar el producto';
      toast.error('Error al actualizar', msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleQtyInputChange = (productId: string, value: string, maxStock: number) => {
    // Permitir valores numéricos, clamp >= 0 y <= maxStock
    let next = parseInt(value, 10);
    if (isNaN(next)) next = 0;
    if (next < 0) next = 0;
    if (maxStock >= 0 && next > maxStock) next = maxStock;
    setLocalQty((prev) => ({ ...prev, [productId]: next }));
  };

  const commitQtyChange = async (productId: string, maxStock: number) => {
    const desired = localQty[productId];
    const item = cart?.items.find((i) => i.productId.id === productId);
    if (item && desired === item.quantity) return; // no cambios

    const finalQty = Math.max(0, Math.min(desired ?? 0, maxStock));
    try {
      setUpdatingId(productId);
      await updateCartItem({ productId, quantity: finalQty });
      await fetchCart();
      if (finalQty === 0) toast.info('Carrito', 'Producto eliminado');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'No se pudo actualizar el producto';
      toast.error('Error al actualizar', msg);
      // Revertir al valor del carrito
      if (item) setLocalQty((prev) => ({ ...prev, [productId]: item.quantity }));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      setUpdatingId(productId);
      await removeFromCart(productId);
      await fetchCart();
      toast.info('Carrito', 'Producto eliminado');
      setLocalQty((prev) => {
        const c = { ...prev };
        delete c[productId];
        return c;
      });
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'No se pudo eliminar el producto';
      toast.error('Error', msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCheckAvailability = async () => {
    try {
      setUpdatingId('CHECK');
      const res = await checkAvailability();
      setAvailabilityResult(res as any);
      setAvailabilityOpen(true);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'No se pudo verificar disponibilidad';
      toast.error('Error', msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const autoFixAvailability = async () => {
    if (!availabilityResult) return;
    try {
      setUpdatingId('FIX');
      for (const item of availabilityResult.unavailableItems) {
        const desired = Math.min(item.requestedQuantity || 0, item.availableStock || 0);
        if ((item.availableStock || 0) <= 0) {
          await removeFromCart(item.productId);
        } else {
          await updateCartItem({ productId: item.productId, quantity: desired });
        }
      }
      toast.success('Carrito actualizado', 'Se aplicaron correcciones de stock');
      setAvailabilityOpen(false);
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'No se pudieron aplicar las correcciones';
      toast.error('Error', msg);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClear = async () => {
    try {
      if (!window.confirm('¿Vaciar todo el carrito? Esta acción no se puede deshacer.')) {
        return;
      }
      setUpdatingId('ALL');
      await clearCart();
      toast.info('Carrito', 'Carrito vaciado');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'No se pudo vaciar el carrito';
      toast.error('Error', msg);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Tu carrito te espera</h1>
          <p className="mt-2 text-gray-600">Inicia sesión para ver tus productos y continuar con tu compra.</p>
          <div className="mt-6 flex gap-3 justify-center">
            <Link href="/login" className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800">Iniciar sesión</Link>
            <Link href="/" className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">Seguir comprando</Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Link href="/" className="inline-flex items-center gap-2 mt-4 text-gray-700 hover:text-black">
            <ArrowLeft className="w-4 h-4" /> Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tu Carrito</h1>

      {isEmpty ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="mt-4 text-gray-700">Tu carrito está vacío.</p>
          <Link href="/" className="inline-block mt-6 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">Ir a comprar</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart!.items.map((item) => (
              <div key={`${item.productId.id}-${item.addedAt}`} className="bg-white rounded-xl shadow p-4 flex gap-4 relative">
                <Link href={`/product/${item.productId.id}`} className="flex-shrink-0">
                  <img
                    src={item.productId.image.url}
                    alt={item.productId.name}
                    className="w-28 h-28 object-cover rounded-md border"
                  />
                </Link>

                <div className="flex-1">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/product/${item.productId.id}`} className="text-lg font-semibold text-gray-900 hover:underline">
                        {item.productId.name}
                      </Link>
                      <p className="text-sm text-gray-500 capitalize">{item.productId.category.replace('-', ' ')}</p>
                      <p className="text-sm text-gray-500">Precio: ${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.productId.id)}
                      disabled={updatingId === item.productId.id}
                      className="text-red-600 hover:text-red-700"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecrease(item.productId.id, item.quantity)}
                        disabled={updatingId === item.productId.id}
                        className="p-2 rounded-md border hover:bg-gray-50"
                        aria-label="Disminuir"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={item.productId.stock}
                        value={localQty[item.productId.id] ?? item.quantity}
                        onChange={(e) => handleQtyInputChange(item.productId.id, e.target.value, item.productId.stock)}
                        onBlur={() => commitQtyChange(item.productId.id, item.productId.stock)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.currentTarget.blur();
                          }
                        }}
                        disabled={updatingId === item.productId.id}
                        className="w-16 text-center border rounded-md py-1"
                        aria-label="Cantidad"
                      />
                      <button
                        onClick={() => handleIncrease(item.productId.id, item.quantity)}
                        disabled={updatingId === item.productId.id}
                        className="p-2 rounded-md border hover:bg-gray-50"
                        aria-label="Aumentar"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right font-semibold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Indicador de actualización por fila */}
                {updatingId === item.productId.id && (
                  <div className="absolute inset-0 bg-white/50 rounded-xl flex items-center justify-center">
                    <div className="flex items-center text-gray-700 text-sm bg-white/90 px-3 py-1.5 rounded-md border">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                      Actualizando...
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl shadow p-6 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h2>
            <div className="flex justify-between text-gray-700">
              <span>Productos</span>
              <span>{stats?.totalItems ?? 0}</span>
            </div>
            <div className="flex justify-between text-gray-700 mt-2">
              <span>Subtotal</span>
              <span>${stats?.totalAmount.toFixed(2) ?? '0.00'}</span>
            </div>
            <div className="h-px bg-gray-200 my-4" />
            <button
              onClick={handleCheckAvailability}
              disabled={updatingId !== null}
              className="w-full mb-3 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Verificar disponibilidad
            </button>
            <button
              onClick={handleClear}
              disabled={updatingId !== null}
              className="w-full mb-3 border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Vaciar carrito
            </button>
            <button
              disabled
              className="w-full bg-orange-500 text-white px-4 py-2 rounded-md opacity-80 cursor-not-allowed"
              title="Checkout próximamente"
            >
              Finalizar compra (próximamente)
            </button>
            <Link href="/" className="block text-center mt-4 text-gray-600 hover:text-black">Seguir comprando</Link>
          </div>
        </div>
      )}
    </div>

    {/* Modal de disponibilidad */}
    {availabilityOpen && availabilityResult && (
      <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
          <div className="flex items-center mb-4">
            {availabilityResult.unavailableItems.length === 0 ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            )}
            <h3 className="text-lg font-semibold">Disponibilidad del carrito</h3>
          </div>

          {availabilityResult.unavailableItems.length === 0 ? (
            <p className="text-gray-700">Todo tu carrito está disponible.</p>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-700">Algunos productos no tienen stock suficiente:</p>
              <ul className="space-y-2">
                {availabilityResult.unavailableItems.map((u) => (
                  <li key={u.itemId} className="text-sm text-gray-700 border rounded-md p-2">
                    <span className="font-medium">{u.productName || u.productId}</span>
                    <span className="ml-2">— {u.reason}.</span>
                    {u.availableStock !== undefined && u.requestedQuantity !== undefined && (
                      <span className="ml-1">
                        Disponible: {u.availableStock}, solicitado: {u.requestedQuantity}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setAvailabilityOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
            {availabilityResult.unavailableItems.length > 0 && (
              <button
                onClick={autoFixAvailability}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Arreglar automáticamente
              </button>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
