import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2'; // Bar 차트 임포트
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Bar 차트 관련 요소 임포트
import axios from 'axios';

// Chart.js의 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function TimeVehicleChart({ options }) {
  const [timeVehicleData, setTimeVehicleData] = useState({
    labels: [], // 시간대
    datasets: [{
      label: '시간별 출입 현황',
      data: [], // 출입 데이터
      borderColor: 'rgba(102, 255, 178, 1)', // 형광 녹색 테두리
      backgroundColor: 'rgba(102, 255, 178, 0.7)', // 형광 녹색 반투명 배경
      fill: true,
      borderWidth: 2, // 막대 테두리 두께를 2로 설정하여 더욱 명확하게
      barPercentage: 0.7, // 막대의 넓이를 조금 줄여서 간격을 넓게 설정
    }]
  });

  useEffect(() => {
    // 서버에서 시간별 출입 데이터를 가져오기
    axios.get('/api/vehicle-time-data')
      .then(response => {
        const allLabels = response.data.labels; // 모든 시간대 데이터
        const allData = response.data.data; // 모든 출입 데이터

        // 오전 9시부터 밤 9시까지 한 시간 간격으로 필터링
        const filteredLabels = allLabels.filter(label => {
          const hour = parseInt(label.split(':')[0], 10);
          return hour >= 9 && hour <= 21; // 9시부터 21시까지 한 시간 간격 필터
        });

        const filteredData = allLabels.map((label, index) => {
          const hour = parseInt(label.split(':')[0], 10);
          // 1시간 간격으로 데이터를 필터링
          if (hour >= 9 && hour <= 21 && label.endsWith(':00')) {
            return allData[index];
          }
          return null;
        }).filter(data => data !== null); // null 값은 제외

        // 필터링된 데이터를 차트에 반영
        setTimeVehicleData({
          labels: filteredLabels.filter(label => label.endsWith(':00')), // 1시간 간격으로 필터된 시간대
          datasets: [{
            label: '시간별 출입 현황',
            data: filteredData, // 필터된 데이터
            borderColor: 'rgba(102, 255, 178, 1)', // 형광 녹색 테두리
            backgroundColor: 'rgba(102, 255, 178, 0.7)', // 형광 녹색 반투명 배경
            fill: true,
            borderWidth: 2, // 막대 테두리 두께
            barPercentage: 0.7, // 막대 넓이를 조절하여 막대 사이 간격 넓히기
          }]
        });
      })
      .catch(error => {
        console.error('Error fetching vehicle time data:', error);
      });
  }, []);

  // options에 x축 레이블을 가로로 표시하도록 수정
  const updatedOptions = {
    ...options, // 기존 options 유지
    scales: {
      x: {
        ...options.scales?.x, // 기존 x축 옵션 유지
        ticks: {
          maxRotation: 0, // x축 레이블을 가로로 표시
          minRotation: 0, // x축 레이블을 가로로 표시
          font: {
            size: 14, // 폰트 크기를 14px로 설정하여 시인성 높임
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif", // 고급스러운 폰트
            weight: 'bold', // 굵은 폰트로 설정
            color: '#fff', // 흰색 폰트로 변경
          },
        },
        grid: {
          display: false, // x축 그리드 라인을 숨김으로써 차트를 깔끔하게
        }
      },
      y: {
        ...options.scales?.y, // y축 옵션도 그대로 유지
        ticks: {
          beginAtZero: true,
          font: {
            size: 14, // 폰트 크기를 14px로 설정
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif", // 고급스러운 폰트
            color: '#fff', // 흰색 폰트로 변경
          },
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.3)', // y축 그리드 라인 색상을 연하게 설정
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 14,
            family: "'Roboto', 'Helvetica Neue', 'Arial', sans-serif", // 고급스러운 폰트
            weight: 'bold',
          },
          color: '#fff', // 범례 텍스트 색상
        }
      },
      tooltip: {
        backgroundColor: 'rgba(102, 255, 178, 0.8)', // 툴팁 배경색을 형광 녹색으로 변경
        titleFont: { size: 14, weight: 'bold', color: '#000' }, // 툴팁 제목 폰트 색상 (검정색으로 시인성 높임)
        bodyFont: { size: 12, color: '#000' }, // 툴팁 본문 폰트 색상
        borderColor: '#fff', // 툴팁 테두리를 흰색으로 설정
        borderWidth: 1, // 툴팁 테두리 두께
        cornerRadius: 4, // 툴팁 모서리를 부드럽게
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
