import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Chart.js에 플러그인 등록
Chart.register(ArcElement, Tooltip, Legend, Title);

const VehicleTypeDoughnut = () => {
  const [inputImages, setInputImages] = useState([]);
  const [outputImages, setOutputImages] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('토큰이 없습니다. 로그인을 먼저 해주세요.');
      navigate('/');
      return;
    }

    const socket = new WebSocket(`ws://10.125.121.189:8080/ws`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("data", data);

      const currentTime = Date.now();
      if (!lastUpdateTime || currentTime - lastUpdateTime >= 3600000) {
        setInputImages(data.inputImages);
        setOutputImages(data.outputImages);
        setLastUpdateTime(currentTime); 
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, [lastUpdateTime, navigate]);

  // 차량 데이터 개수를 계산
  const vehicleCounts = {
    '5톤트럭': 0,
    '10톤트럭': 0,
    '15톤트럭': 0,
    '20톤트럭': 0
  };

  // Merge input and output images for counting
  const allImages = [...outputImages];
  allImages.forEach(image => {
    const cartype = image.cartype;
    if (vehicleCounts[cartype] !== undefined) {
      vehicleCounts[cartype]++;
    }
  });

  // Doughnut chart의 데이터 (차량 유형마다 다른 배경색과 보더 색상 적용)
const vehicleTypeData = {
  labels: ['5톤', '10톤', '15톤', '20톤'],
  datasets: [{
    data: [
      vehicleCounts['5톤트럭'],
      vehicleCounts['10톤트럭'],
      vehicleCounts['15톤트럭'],
      vehicleCounts['20톤트럭']
    ],
    backgroundColor: [
      '#1E90FF', // 5톤트럭 - 도돈 파랑색
      '#6495ED  ', // 15톤트럭 - 다크 블루
      '#4169E1', // 10톤트럭 - 로얄 블루
      '#000080'  // 20톤트럭 - 네이비
    ], // 차량 유형마다 다르게 설정한 어두운 배경색
    borderColor: [
      '#ADFF2F', // 5톤트럭 형광 녹색
      '#FF4500', // 10톤트럭 형광 오렌지
      '#00CED1', // 15톤트럭 형광 청록색
      '#FFD700'  // 20톤트럭 형광 노란색
    ], // 차량 유형마다 다르게 설정한 형광 보더
    borderWidth: 2, // 보더 두께 설정
    
    
  }]
};

  // 인라인 스타일을 사용해 최대 너비만 설정
  const chartStyle = {
    maxWidth: '300px',  // 최대 너비 설정
    width: '100%',      // 가로 크기 비율에 맞게 조정
    margin: '0 auto',   // 가운데 정렬
  };

  return (
    <div style={chartStyle}>
      <Doughnut
        data={vehicleTypeData}
        options={{
          responsive: true,
          maintainAspectRatio: true,  // 비율 유지
          plugins: {
            title: {
              display: true,
              text: '차량구분', // 차트 제목
              font: {
                size: 18,
                weight: 'bold',
                family: "'Helvetica', 'Arial', sans-serif"
              },
              color: '#333'  // 제목의 색상
            },
            legend: {
              labels: {
                font: {
                  size: 14,
                  family: "'Helvetica', 'Arial', sans-serif"
                },
                color: '#333', // 범례 텍스트 색상
              },
            },
          },
          hover: {
            mode: null // 모든 데이터 항목에 동일한 호버 적용
          }
        }}
      />
    </div>
  );
}

export default VehicleTypeDoughnut;
