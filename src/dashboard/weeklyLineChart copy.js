

import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register components needed for the Pie chart
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const WeeklyPieChart = ({ year, month }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // 인증 토큰 가져오기
   
    const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.0.142:8080/member/graph?year=${year}&month=${month}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        console.log(data);

       // Assuming data is an array with one object
       if (Array.isArray(data) && data.length > 0) {
        const dataObject = data[0];
        console.log('Data Object:', dataObject);

       
        // Transform dataObject into Chart.js format
        const labels = Object.keys(dataObject);
        const values = Object.values(dataObject).map(val => parseInt(val, 10));

        setChartData({
        labels: labels,
        datasets: [
            {
            label: 'Pie Chart Data',
            data: values,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Add more colors if needed
            },
        ],
        });

    }
  

      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    
    };
    if (year && month) {
        fetchData();
        }
 
  }, [year, month]); // year와 month 값이 변경될 때마다 데이터 페치
// year2와 month가 유효할 때만 데이터 요청
    

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
  
    const options = {
       plugins: {
         tooltip: {
           callbacks: {
             label: function (context) {
               // context 데이터로부터 값을 가져옴
               const label = context.label || '';
               const value = context.raw;
               return `${label}: ${value}`;
             }
           }
         },
         datalabels: {
           formatter: (value, context) => {
             return value;
           },
           color: '#000',
           anchor: 'end',
           align: 'top',
           offset: 10,
         }
       }
   }

  return (
    <div>
      <h1>주간 통계 {year}년 {month}월 주별</h1>
      {chartData && <Pie data={chartData} options={options} />}
    </div>
  );
};

export default WeeklyPieChart;