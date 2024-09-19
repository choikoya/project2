import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const MonthlyLineChart = ({ year}) => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const token = localStorage.getItem('authToken'); // 인증 토큰 가져오기
      const fetchData = async () => {
      try {
        const response = await fetch(`http://192.168.0.142:8080/member/graph?year=${year}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
            'Content-Type': 'application/json', // 데이터 전송 형식을 URL 인코딩으로 설정
          },
          
        })
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const  data = await response.json();
  
        console.log( data)
  
               // 데이터를 가공
        const labels = [];
        const dataValues = [];
               
        data.forEach(item => {
                 const key = Object.keys(item)[0];
                 if (!key.startsWith('year_')) {
                   labels.push(key);
                   dataValues.push(Number(item[key]));
                 }
        });
               
               // 데이터셋 설정
        setChartData({
                 labels,
                 datasets: [
                   {
                     label: '입출차 차량 통계',
                     data: dataValues,
                     borderColor: '#4bc0c0',
                     backgroundColor: 'rgba(75, 192, 192, 0.2)',
                     fill: true,
                   },
                 ],
        });
      } catch (error) {
               setError(error);
      } finally {
               setLoading(false);
      }
      };
       
      fetchData();
  }, [year]);
  
  
   if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
  
    return (
      <div>
        <h1>월간 통계 {year} 1~12월</h1>
        <Line data={chartData} />
      </div>
    );
  }
  
  export default MonthlyLineChart;