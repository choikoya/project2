import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import '../css/chartStyle.css';

const YearlyLineChart = ({ year }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken'); // 인증 토큰 가져오기
    const fetchData = async () => {
      try {
        const response = await fetch(`http://10.125.121.189:8080/member/graph?year=${year}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // 데이터를 가공
        const labels = [];
        const dataValues = [];

        data.forEach(item => {
          const key = Object.keys(item)[0];
          if (key.startsWith('year_')) {
            labels.push(key);
            dataValues.push(Number(item[key]));
          }
        });

        // 데이터셋 설정 (형광색 및 스타일 설정)
        setChartData({
          labels,
          datasets: [
            {
              label: '연간 차량 통계',
              data: dataValues,
              borderColor: '#00FF7F', // 형광 연두색 선
              backgroundColor: 'rgba(0, 255, 127, 0.2)', // 형광 연두색 배경 (투명도)
              fill: true, // 배경 채우기 여부
              borderWidth: 3, // 선 두께
              pointBackgroundColor: '#FFD700', // 데이터 포인트 색상 (형광 노란색)
              pointBorderColor: '#fff', // 데이터 포인트 테두리 색상
              pointHoverBackgroundColor: '#FF4500', // 데이터 포인트 hover 시 색상 (밝은 오렌지색)
              pointHoverBorderColor: '#fff', // 데이터 포인트 hover 시 테두리 색상
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

  // 차트 옵션 설정
  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false, // x축 그리드 라인 숨김
        },
        ticks: {
          color: '#FFFFFF', // x축 텍스트 색상을 흰색으로 변경
          font: {
            size: 14, // x축 텍스트 크기 조정
          },
        },
      },
      y: {
        grid: {
          color: '#e0e0e0', // y축 그리드 라인 색상
        },
        beginAtZero: true,
        ticks: {
          color: '#FFFFFF', // y축 텍스트 색상을 흰색으로 변경
          font: {
            size: 14, // y축 텍스트 크기 조정
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#fff', // 범례 텍스트 색상 (밝게)
        },
      },
      tooltip: {
        backgroundColor: '#1abc9c', // 툴팁 배경색을 형광스러운 밝은 초록색으로 변경
        titleFont: { size: 14, color: '#000' }, // 툴팁 제목 폰트 색상 (검은색으로 시인성 높임)
        bodyFont: { size: 12, color: '#000' }, // 툴팁 본문 폰트 색상 (검은색으로 시인성 높임)
        borderColor: '#FFD700', // 툴팁 테두리를 밝은 노란색으로 설정 (고급스러운 형광 느낌)
        borderWidth: 2, // 툴팁 테두리 두께
        cornerRadius: 5, // 툴팁 모서리를 둥글게
        padding: 10, // 툴팁 내부 여백
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default YearlyLineChart;
