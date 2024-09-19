import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
const DailyLineChart = ({ year, month, day }) => {
    const [chartData, setChartData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(`/api/data?year=${year}&month=${month}&day=${day}`);
        const data = await response.json();
  
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: `출입 차량 통계 (${year}년 ${month}월 ${day}일)`,
              data: data.values,
              borderColor: '#ffcd56',
              backgroundColor: 'rgba(255, 205, 86, 0.2)',
              fill: true,
            },
          ],
        });
      };
  
      if (year && month && day) {
        fetchData();
      }
    }, [year, month, day]);
  
    if (!chartData) return <div>Loading...</div>;
  
    return <Line data={chartData} />;
  };
  
  export default DailyLineChart;
  