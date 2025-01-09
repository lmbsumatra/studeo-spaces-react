// UserGrowthChart.jsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { baseApiUrl } from "../../App";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
} from "chart.js";
import { formatDate } from "../../utils/dateFormat";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title);

const UserGrowthChart = () => {
  const [userGrowthData, setUserGrowthData] = useState([]);

  useEffect(() => {
    const fetchUserGrowthData = async () => {
      try {
        const response = await axios.get(`${baseApiUrl}user-growth-data`);
        setUserGrowthData(response.data);
      } catch (error) {
        // console.error("Error fetching user growth data", error);
      }
    };

    fetchUserGrowthData();
  }, []);

  const chartData = {
    labels: userGrowthData.map((data) => formatDate(data.date)), // Dates for the x-axis
    datasets: [
      {
        label: "New Users",
        data: userGrowthData.map((data) => data.new_users), // Data points for the y-axis
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div>
      <Line data={chartData} />
    </div>
  );
};

export default UserGrowthChart;
