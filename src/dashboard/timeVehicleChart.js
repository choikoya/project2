import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2'; 
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TimeVehicleChart({ options }) {
  const [timeVehicleData, setTimeVehicleData] = useState({
    labels: [], 
    datasets: [{
      label: '시간별 출입 현황',
      data: [], 
      borderColor: 'rgba(102, 255, 178, 1)', 
      backgroundColor: 'rgba(102, 255, 178, 0.7)', 
      fill: true,
      borderWidth: 2,
      barPercentage: 0.7,
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://192.168.0.142:8080/member/graph/hours?year=2024&month=10&day=1', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error('일일 데이터 가져오기 실패');
        }

        const data = await response.json();
        console.log("하루 데이터:", data);

        // Extracting labels and data for 9 AM to 9 PM
        const filteredLabels = [];
        const filteredData = [];

        for (let hour = 9; hour <= 21; hour++) {
          const label = `${String(hour).padStart(2, '0')}:00 - ${String(hour).padStart(2, '0')}:59`;
          if (data[label] !== undefined) {
            filteredLabels.push(label);
            filteredData.push(data[label]);
          }
        }

        // Update the chart data
        setTimeVehicleData({
          labels: filteredLabels,
          datasets: [{
            label: '시간별 출입 현황',
            data: filteredData,
            borderColor: 'rgba(102, 255, 178, 1)', 
            backgroundColor: 'rgba(102, 255, 178, 0.7)', 
            fill: true,
            borderWidth: 2,
            barPercentage: 0.7,
          }]
        });
      } catch (error) {
        console.error('Error fetching vehicle time data:', error);
      }
    };

    fetchData(); // Fetch data when component mounts
  }, []);

  const updatedOptions = {
    ...options,
    scales: {
      x: {
        ...options.scales?.x,
        ticks: {
          maxRotation: 0,
          minRotation: 0,
          font: {
            size: 14,
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
            weight: 'bold',
            color: '#fff',
          },
        },
        grid: {
          display: false,
        }
      },
      y: {
        ...options.scales?.y,
        ticks: {
          beginAtZero: true,
          font: {
            size: 14,
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
            color: '#fff',
          },
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)',
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 14,
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif",
            weight: 'bold',
          },
          color: '#fff',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(102, 255, 178, 0.8)',
        titleFont: { size: 14, weight: 'bold', color: '#000' },
        bodyFont: { size: 12, color: '#000' },
        borderColor: '#fff',
        borderWidth: 1,
        cornerRadius: 4,
      }
    }
  };

  return (
    <div className="graph-wrapper">
      <Bar data={timeVehicleData} options={updatedOptions} />
    </div>
  );
}

export default TimeVehicleChart;