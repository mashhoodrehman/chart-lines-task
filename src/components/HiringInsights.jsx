"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

const HiringInsights = ({ initialData = null }) => {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState("Last 30 days");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const timeframeOptions = {
    "Last 7 days": 7,
    "Last 14 days": 14,
    "Last 30 days": 30,
  };

  const formatChartData = (rawData) => {
    return rawData.labels.map((label, index) => ({
      day: label,
      applicationToInterviewRate: rawData.datasets.applicationToInterviewRate[index],
      offerAcceptanceRate: rawData.datasets.offerAcceptanceRate[index],
      rejectionRate: rawData.datasets.rejectionRate[index],
    }));
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
              Math.floor(100 * (i + 1) / days)
            ),
            offerAcceptanceRate: Array.from({ length: days }, (_, i) =>
              Math.floor(100 * Math.pow(i / days, 1.2))
            ),
            rejectionRate: Array.from({ length: days }, (_, i) =>
              Math.floor(100 * Math.abs(Math.sin(i / 10)) / 3)
            ),
          },
        });
      }, 500);
    });
  };

  const fetchAndSetData = async (days) => {
    const rawData = await getHiringInsights(days);
    setData(formatChartData(rawData));
  };

  useEffect(() => {
    if (initialData) {
      setData(formatChartData(initialData));
    } else {
      fetchAndSetData(30);
    }
  }, [initialData]);

  const handleSelect = (label) => {
    setTimeframe(label);
    setDropdownOpen(false);
    fetchAndSetData(timeframeOptions[label]);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white p-2 rounded shadow text-xs border"
          style={{ fontFamily: "Lato, sans-serif", fontSize: "12px" }}
        >
          <p className="font-semibold">Day: {label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
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

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            {/* ✅ Only Y-Axis Grid Lines (Horizontal) */}
            <CartesianGrid
              stroke="#e5e7eb"
              strokeDasharray="3 3"
              vertical={false}
              horizontal={true}
            />
            <XAxis
              dataKey="day"
              stroke="#6b7280"
              tick={{
                fontSize: 12,
                fontFamily: "Lato, sans-serif",
                fill: "#6b7280",
              }}
              axisLine={{ stroke: "#d1d5db" }}
              tickLine={{ stroke: "#d1d5db" }}
            />
            <YAxis
              stroke="#6b7280"
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              tick={{
                fontSize: 12,
                fontFamily: "Lato, sans-serif",
                fill: "#6b7280",
              }}
              axisLine={{ stroke: "#d1d5db" }}
              tickLine={{ stroke: "#d1d5db" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                fontSize: "12px",
                fontFamily: "Lato, sans-serif",
                marginTop: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="applicationToInterviewRate"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Application to Interview Rate"
            />
            <Line
              type="monotone"
              dataKey="offerAcceptanceRate"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
              name="Offer Acceptance Rate"
            />
            <Line
              type="monotone"
              dataKey="rejectionRate"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
              name="Rejection Rate"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-10 text-gray-500">Loading chart...</div>
      )}
    </div>
  );
};

export default HiringInsights;
