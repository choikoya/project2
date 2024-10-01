import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const DailyLineChart = ({ year, month, day }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 서버에서 해당 날짜의 데이터를 가져옴
        const response = await fetch(`/api/data?year=${year}&month=${month}&day=${day}`);
        const data = await response.json();

        // 시간 레이블 설정: 9:00 ~ 21:00 한 시간 간격
        const timeLabels = Array.from({ length: 13 }, (_, i) => `${i + 9}:00`);

        // 서버에서 받은 데이터를 시간에 맞게 매핑 (예: data.values가 시간 순서로 정렬되어 있다고 가정)
        // data.values가 각 시간대에 해당하는 값이라고 가정
        const mappedValues = timeLabels.map((label, index) => {
          // 예시: 해당 시간대에 대응하는 데이터가 있으면 사용, 없으면 0
          return data.values[index] || 0;
        });

        setChartData({
          labels: timeLabels, // 9시부터 21시까지의 시간 레이블
          datasets: [
            {
              label: `출입 차량 통계 (${year}년 ${month}월 ${day}일)`,
              data: mappedValues, // 매핑된 데이터
              borderColor: '#ffcd56', // 선 색상
              backgroundColor: 'rgba(255, 205, 86, 0.2)', // 배경색
              fill: true, // 배경 채우기
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching daily data:', error);
      }
    };

    // 년, 월, 일이 설정되어 있을 때만 데이터를 가져옴
    if (year && month && day) {
      fetchData();
    }
  }, [year, month, day]);

  if (!chartData) return <div>Loading...</div>;

  // 차트 옵션 (필요에 따라 추가)
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: '시간',
        },
      },
      y: {
        title: {
          display: true,
          text: '차량 수',
        },
        beginAtZero: true, // Y축이 0부터 시작
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default DailyLineChart;
