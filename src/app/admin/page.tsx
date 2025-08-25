"use client";

import SalesChart from "@/components/admin/SalesChart";
import TopProductsChart from "@/components/admin/TopProductsChart";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import { useToastContext } from "@/contexts/ToastContext";
import { useEffect, useRef } from "react";

// Datos simulados para el dashboard
const simulatedStats = {
  totalProducts: 45,
  lowStockProducts: 8,
  monthlySales: 2300,
  revenue: 15230.5,
  simulatedSales: [
    { month: "Enero", sales: 1200 },
    { month: "Febrero", sales: 1900 },
    { month: "Marzo", sales: 1400 },
    { month: "Abril", sales: 2100 },
    { month: "Mayo", sales: 1800 },
    { month: "Junio", sales: 2300 },
  ],
};

export default function AdminDashboardPage() {
  const toast = useToastContext();
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Solo mostrar el toast la primera vez que se carga
    if (!hasShownToast.current) {
      toast.info('Dashboard cargado', 'Datos actualizados correctamente');
      hasShownToast.current = true;
    }
  }, [toast]);

  const metricsCards = [
    {
      name: "Total de Productos",
      value: simulatedStats.totalProducts.toString(),
      icon: Package,
      color: "bg-blue-500",
    },
    {
      name: "Productos Bajo Stock",
      value: simulatedStats.lowStockProducts.toString(),
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      name: "Ventas del Mes",
      value: simulatedStats.monthlySales.toString(),
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      name: "Total Revenue",
      value: `$${simulatedStats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsCards.map((metric) => (
          <div
            key={metric.name}
            className="bg-white p-6 rounded-lg shadow-md flex items-center"
          >
            <div className={`p-3 rounded-full text-white mr-4 ${metric.color}`}>
              <metric.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{metric.name}</p>
              <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Ventas Simuladas
        </h2>
        <SalesChart salesData={simulatedStats.simulatedSales} />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Productos Más Vendidos
        </h2>
        <TopProductsChart />
      </div>
    </div>
  );
}
