"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ChevronDown } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HiringInsights = ({ initialData = null }) => {
  const [data, setData] = useState(initialData);
  const [timeframe, setTimeframe] = useState("Last 30 days");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const timeframeOptions = {
    "Last 7 days": 7,
    "Last 14 days": 14,
    "Last 30 days": 30,
  };

  const getHiringInsights = async (days) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          labels: Array.from({ length: days }, (_, i) =>
            (i + 1).toString().padStart(2, "0")
          ),
          datasets: {
            applicationToInterviewRate: Array.from({ length: days }, (_, i) =>
              Math.floor(40 + 30 * Math.sin(i / 4))
            ),
            offerAcceptanceRate: Array.from({ length: days }, (_, i) =>
              Math.floor(50 + 25 * Math.cos(i / 5))
            ),
            rejectionRate: Array.from({ length: days }, (_, i) =>
              Math.floor(60 + 30 * Math.sin(i / 6 + 2))
            ),
          },
        });
      }, 500);
    });
  };

  const fetchAndSetData = async (days) => {
    const chartData = await getHiringInsights(days);
    setData(chartData);
  };

  useEffect(() => {
    if (!initialData) fetchAndSetData(30);
  }, [initialData]);

  const handleSelect = (label) => {
    setTimeframe(label);
    setDropdownOpen(false);
    fetchAndSetData(timeframeOptions[label]);
  };

  const chartData = data
    ? {
        labels: data.labels,
        datasets: [
          {
            label: "Application to Interview Rate",
            data: data.datasets.applicationToInterviewRate,
            borderColor: "#22c55e",
            backgroundColor: "#22c55e",
            tension: 0.4,
          },
          {
            label: "Offer Acceptance Rate",
            data: data.datasets.offerAcceptanceRate,
            borderColor: "#8b5cf6",
            backgroundColor: "#8b5cf6",
            tension: 0.4,
          },
          {
            label: "Rejection Rate",
            data: data.datasets.rejectionRate,
            borderColor: "#f97316",
            backgroundColor: "#f97316",
            tension: 0.4,
          },
        ],
      }
    : null;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#000",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      y: {
        ticks: {
          color: "#6b7280",
        },
        grid: {
          color: "#e5e7eb",
        },
      },
      x: {
        ticks: {
          color: "#6b7280",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full max-w-4xl mx-auto relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Hiring Insights</h2>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-1 border text-sm text-gray-600 border-gray-300 rounded px-3 py-1.5 hover:bg-gray-100"
          >
            {timeframe} <ChevronDown className="w-4 h-4" />
          </button>
          {dropdownOpen && (
            <ul className="absolute right-0 z-10 mt-2 w-48 bg-white border border-gray-200 rounded shadow text-sm">
              {Object.keys(timeframeOptions).map((label) => (
                <li key={label}>
                  <button
                    onClick={() => handleSelect(label)}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {chartData ? (
        <Line options={options} data={chartData} />
      ) : (
        <div className="text-center py-10 text-gray-500">Loading chart...</div>
      )}
    </div>
  );
};

export default HiringInsights;
