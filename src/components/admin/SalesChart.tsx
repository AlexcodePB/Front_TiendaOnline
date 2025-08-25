'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesChartProps {
  salesData?: Array<{ month: string; sales: number }>;
}

export default function SalesChart({ salesData }: SalesChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Ventas Mensuales Simuladas',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const defaultSalesData = [
    { month: 'Enero', sales: 1200 },
    { month: 'Febrero', sales: 1900 },
    { month: 'Marzo', sales: 1400 },
    { month: 'Abril', sales: 2100 },
    { month: 'Mayo', sales: 1800 },
    { month: 'Junio', sales: 2300 }
  ];

  const dataToUse = salesData || defaultSalesData;

  const data = {
    labels: dataToUse.map(item => item.month),
    datasets: [
      {
        label: 'Ventas',
        data: dataToUse.map(item => item.sales),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="relative h-80 w-full">
      <Bar options={options} data={data} />
    </div>
  );
}
