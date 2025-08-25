import React from "react";
import { Box } from "@mui/material";
import { Bar } from "react-chartjs-2";
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

export default function RatingsChart({ monthlyRatings }) {
  const dataset = monthlyRatings || [];

  const months = dataset.map((d) => d.month);

  const data = {
    labels: months,
    datasets: [
      {
        label: "1 ★",
        data: dataset.map((d) => d.r1),
        backgroundColor: "rgba(248, 113, 113, 0.8)",
        borderRadius: 6,
      },
      {
        label: "2 ★",
        data: dataset.map((d) => d.r2),
        backgroundColor: "rgba(251, 191, 36, 0.8)",
        borderRadius: 6,
      },
      {
        label: "3 ★",
        data: dataset.map((d) => d.r3),
        backgroundColor: "rgba(96, 165, 250, 0.8)",
        borderRadius: 6,
      },
      {
        label: "4 ★",
        data: dataset.map((d) => d.r4),
        backgroundColor: "rgba(52, 211, 153, 0.8)",
        borderRadius: 6,
      },
      {
        label: "5 ★",
        data: dataset.map((d) => d.r5),
        backgroundColor: "rgba(167, 139, 250, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: { display: true, text: "Months" },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: "Ratings Count" },
        beginAtZero: true,
        grid: { display: false },
      },
    },
    plugins: { legend: { position: "top" } },
  };

  return (
    <Box sx={{ width: "100%", height: 400 }}>
      <Bar data={data} options={options} />
    </Box>
  );
}
