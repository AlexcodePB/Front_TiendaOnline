'use client';

import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// This data is static for simulation purposes.
export const data = {
  labels: ['Element Section 8.25"', 'Bones Reds Bearings', 'Independent Stage 11', 'Spitfire Formula Four', 'Thunder Hollow Lights', 'Mob Grip Tape'],
  datasets: [
    {
      label: '# of Sales',
      data: [120, 95, 80, 75, 60, 110],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    title: {
      display: false,
    },
  },
};

export default function TopProductsChart() {
  return (
    <div className="relative h-80 w-full">
      <Doughnut data={data} options={options} />
    </div>
  );
}
