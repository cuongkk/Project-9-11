"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { setReloadToast } from "@/utils/toast";

type RevenueChartData = {
  dataMonthCurrent: number[];
  dataMonthPrevious: number[];
};

interface ChartProps {
  selectedMonth: string;
}

export const RevenueChart = ({ selectedMonth }: ChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRevenueChart = async () => {
      setIsLoading(true);
      try {
        const [year, month] = selectedMonth.split("-").map(Number);
        const currentMonth = month;
        const currentYear = year;
        const previousMonth = month === 1 ? 12 : month - 1;
        const previousYear = month === 1 ? year - 1 : year;

        // Generate array of days for the selected month
        const daysInMonth = new Date(year, month, 0).getDate();
        const arrayDay = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/dashboard/revenue-chart`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            currentMonth,
            currentYear,
            previousMonth,
            previousYear,
            arrayDay,
          }),
        });

        const responseData = await response.json();

        if (responseData.code === "success") {
          const ctx = canvasRef.current;
          if (ctx) {
            // Destroy previous chart instance if it exists
            if (chartInstance) {
              chartInstance.destroy();
            }

            const newChart = new Chart(ctx, {
              type: "line",
              data: {
                labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`),
                datasets: [
                  {
                    label: "Tháng hiện tại",
                    data: responseData.dataMonthCurrent,
                    borderColor: "#4880ff",
                    backgroundColor: "rgba(72, 128, 255, 0.1)",
                    tension: 0.4,
                  },
                  {
                    label: "Tháng trước",
                    data: responseData.dataMonthPrevious,
                    borderColor: "#cccccc",
                    backgroundColor: "rgba(200, 200, 200, 0.1)",
                    tension: 0.4,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              },
            });

            setChartInstance(newChart);
          }
        }
      } catch (error) {
        console.error("Error fetching revenue chart:", error);
        setReloadToast("error", "Lỗi khi tải dữ liệu biểu đồ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenueChart();
  }, [selectedMonth, chartInstance]);

  return (
    <div className="w-full h-80 bg-gray-50 border border-gray-300 rounded">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};
