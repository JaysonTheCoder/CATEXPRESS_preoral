import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyExpensesChart = () => {
  // Original data
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const values = [12000, 15000, 14000, 16000, 13000, 17000, 14500, 15500, 15000, 16000, 13500, 15000];

  // Sort the data and labels in descending order of values
  const sortedData = values
    .map((value, index) => ({ label: labels[index], value }))
    .sort((a, b) => b.value - a.value);

  const sortedLabels = sortedData.map((item) => item.label);
  const sortedValues = sortedData.map((item) => item.value);

  const data = {
    labels: sortedLabels,
    datasets: [
      {
        label: 'Monthly Expenses (PHP)',
        data: sortedValues,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Makes the bars horizontal
    scales: {
      x: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Expenses (Sorted)',
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyExpensesChart;
