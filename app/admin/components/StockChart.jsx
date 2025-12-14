"use client";

import { Doughnut } from "react-chartjs-2";
import { useProducts } from "@/lib/firestore/products/read";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StockChart() {
  const { data: products } = useProducts();

  const inStock = products?.filter(p => (p.stock || 0) > 0)?.length || 0;
  const outOfStock = products?.filter(p => (p.stock || 0) === 0)?.length || 0;
  const lowStock = products?.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5)?.length || 0;

  const data = {
    labels: ["In Stock", "Out of Stock", "Low Stock"],
    datasets: [
      {
        data: [inStock, outOfStock, lowStock],
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Stock Status",
      },
    },
  };

  return (
    <section className="bg-white p-5 rounded-xl shadow w-full h-[430px]">
      <Doughnut data={data} options={options} />
    </section>
  );
}