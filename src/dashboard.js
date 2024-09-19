import React, { useState } from 'react';
import EntryList from './entryList';
import TimeVehicleChart from './timeVehicleChart';
import VehicleTypeDoughnut from './vehicleTypeDoughnut';
import Notice from './notice';
import Graph from './graph'; 
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './dashboard.css';

// Chart.js 플러그인 활성화
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const [entryList] = useState([
    { carNumber: '가 1234', entryTime: '2024년 9월 3일 오후 1:07', exitTime: '2024년 9월 3일 오후 2:07', phoneNumber: '010-000-0000' },
    { carNumber: '나 5678', entryTime: '2024년 9월 3일 오후 1:10', exitTime: '2024년 9월 3일 오후 2:10', phoneNumber: '010-123-4567' },
    { carNumber: '다 9012', entryTime: '2024년 9월 3일 오후 1:15', exitTime: '2024년 9월 3일 오후 2:15', phoneNumber: '010-987-6543' },
    { carNumber: '라 3456', entryTime: '2024년 9월 3일 오후 1:20', exitTime: '2024년 9월 3일 오후 2:20', phoneNumber: '010-555-5555' },
  ]);

  const timeVehicleData = {
    labels: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30'],
    datasets: [{ label: '시간별 출입 현황', data: [5, 10, 15, 8, 12, 20, 7, 9], borderColor: 'rgba(255,99,132,1)', backgroundColor: 'rgba(255,99,132,0.4)', fill: true, tension: 0.4 }]
  };

  const vehicleTypeData = {
    labels: ['트럭', '비트럭'],
    datasets: [{ data: [60, 40], backgroundColor: ['#FF6384', '#36A2EB'], hoverBackgroundColor: ['#FF6384', '#36A2EB'] }]
  };

  return (
    <div className="dashboard">
      <EntryList entryList={entryList} />
      <div className="flex-container">
        <div className="flex-item"> {/* Graph와 TimeVehicleChart를 감싸는 컨테이너 */}
          <Graph />
        </div>
        <div className="flex-item"> {/* 나란히 배치된 TimeVehicleChart */}
          <TimeVehicleChart data={timeVehicleData} options={{ responsive: true }} />
        </div>
        <VehicleTypeDoughnut data={vehicleTypeData} options={{ responsive: true }} />
        {/* 공지사항 등록 및 검색 기능을 숨김 */}
        <Notice hideControls />
      </div>
    </div>
  );
}

export default Dashboard;
