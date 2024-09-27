import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Chart.js에 플러그인 등록
Chart.register(ArcElement, Tooltip, Legend);

const VehicleTypeDoughnut = ({ data, options }) => {
  // 인라인 스타일을 사용해 최대 너비만 설정
  const chartStyle = {
    maxWidth: '300px',  // 최대 너비 설정
    width: '100%',      // 가로 크기 비율에 맞게 조정
    margin: '0 auto',   // 가운데 정렬
  };

  return (
    <div style={chartStyle}>
      <Doughnut
        data={data}
        options={{
          ...options,
          maintainAspectRatio: true,  // 비율 유지
        }}
      />
    </div>
  );
}

export default VehicleTypeDoughnut;
