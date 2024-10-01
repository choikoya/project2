import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const WeeklyLineChart = ({ year, month }) => {
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

        // 데이터를 가공
        const labels = Array.from({ length: Object.keys(data[0]).length }, (_, i) => `${i + 1}주`);
        const dataValues = Object.values(data[0]).map(value => Number(value));

        setChartData({
          labels,
          datasets: [
            {
              label: '주간 출입 차량 통계',
              data: dataValues,
              borderColor: '#7FFF00', // 밝은 형광 녹색 선
              backgroundColor: 'rgba(127, 255, 0, 0.2)', // 형광 녹색 배경 (투명도)
              fill: true,
              tension: 0.4,
              pointBackgroundColor: '#1E90FF', // 데이터 포인트 색상 (밝은 파란색)
              pointBorderColor: '#fff', // 데이터 포인트 테두리 색상
              pointHoverBackgroundColor: '#00CED1', // 데이터 포인트 hover 시 색상 (청록색)
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

    if (year && month) {
      fetchData();
    }
  }, [year, month]);

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
        backgroundColor: '#00CED1', // 툴팁 배경색을 밝은 청록색으로 변경
        titleFont: { size: 14, color: '#000000' }, // 툴팁 제목 폰트 색상 (검은색으로 시인성 높임)
        bodyFont: { size: 12, color: '#000000' }, // 툴팁 본문 폰트 색상 (검은색으로 시인성 높임)
        titleColor: '#000000', // 제목 텍스트 색상 (검은색)
        bodyColor: '#000000', // 본문 텍스트 색상 (검은색)
        borderColor: '#1E90FF', // 툴팁 테두리를 밝은 파란색으로 설정
        borderWidth: 2, // 툴팁 테두리 두께
        cornerRadius: 5, // 툴팁 모서리를 둥글게
        padding: 10, // 툴팁 내부 여백
      },
    },
  };

  return (
    <div className="chart-container">
      {chartData && <Line data={chartData} options={chartOptions} />}
    </div>
  );
};

export default WeeklyLineChart;
