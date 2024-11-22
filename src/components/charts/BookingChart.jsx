import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { formatDate } from '../../utils/dateFormat';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BookingChart = ({ data = {} }) => {
  const [timeframe, setTimeframe] = useState('daily');

  // Function to prepare data based on the selected timeframe
  const prepareChartData = (data, timeframe) => {
    const selectedData = data[timeframe] || []; // Select data based on timeframe

    if (!Array.isArray(selectedData)) {
      console.error('Expected selectedData to be an array, but received:', selectedData);
      return [];
    }

    return selectedData.map(entry => {
      let label;
      switch (timeframe) {
        case 'monthly':
          label = entry.period || 'Unknown Month'; // Handle missing month label
          break;
        case 'daily':
        default:
          label = entry.period || 'Unknown Date'; // Handle missing date label
          break;
      }

      return {
        label,
        total_bookings: entry.total_bookings,
      };
    });
  };

  const preparedData = prepareChartData(data, timeframe);

  // Prepare data for the chart
  const chartData = {
    labels: preparedData.map(entry => formatDate(entry.label, timeframe)),
    datasets: [
      {
        label: 'Total Bookings',
        data: preparedData.map(entry => entry.total_bookings),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <div>
        <select className="form-select w-25 mt-2 mb-2" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <Bar data={chartData} options={options}  className="bg-white rounded"/>
    </div>
  );
};

export default BookingChart;
