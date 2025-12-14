"use client";

import { Bar } from "react-chartjs-2";
import { useProducts } from "@/lib/firestore/products/read";
import { useCategories } from "@/lib/firestore/categories/read";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CategoryChart() {
  const { data: products } = useProducts();
  const { data: categories } = useCategories();

  const categoryData = categories?.map(category => ({
    name: category.name,
    count: products?.filter(p => p.categoryId === category.id)?.length || 0
  })) || [];

  const data = {
    labels: categoryData.map(item => item.name),
    datasets: [
      {
        label: "Products",
        data: categoryData.map(item => item.count),
        backgroundColor: "#6366f1",
        borderColor: "#4f46e5",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Products by Category",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <section className="bg-white p-5 rounded-xl shadow w-full h-[430px]">
      <Bar data={data} options={options} />
    </section>
  );
}