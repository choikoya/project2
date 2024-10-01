import React, { useState, useEffect } from 'react';
import TimeVehicleChart from './timeVehicleChart';
import VehicleTypeDoughnut from './vehicleTypeDoughnut';
import Notice from '../notice/notice';
import Graph from './graph'; 
import InoutList from './inoutList'; // TimeTable 대신 InoutList를 임포트
import { Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import '../css/dashboard.css';
import { useNavigate } from 'react-router-dom';

// Chart.js 플러그인 활성화
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {
  const [role, setRole] = useState(''); // role 상태 추가
  const [inputImages, setInputImages] = useState([]);
  const [outputImages, setOutputImages] = useState([]);
  const [lastUpdateTime, setLastUpdateTime] = useState(null); // Track the last update time
  const navigate = useNavigate();




  // 세션에서 role 값 가져오기
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    console.log('Dashboard loaded'); // useEffect가 실행될 때 확인하기 위한 로그
    const storedRole = sessionStorage.getItem('userRole');
    console.log('Stored role:', storedRole); // role 값이 제대로 가져와지는지 확인
    setRole(storedRole);
  }, []);

  

  // 더 이상 임의 데이터를 정의할 필요 없음
  // const timeVehicleData = {
  //   labels: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30'],
  //   datasets: [{ 
  //     label: '시간별 출입 현황', 
  //     data: [5, 10, 15, 8, 12, 20, 7, 9], 
  //     borderColor: 'rgba(255,99,132,1)', 
  //     backgroundColor: 'rgba(255,99,132,0.4)', 
  //     fill: true, 
  //     tension: 0.4 
  //   }]
  // };

  const vehicleTypeData = {
    labels: ['트럭', '비트럭'],
    datasets: [{ 
      data: [60, 40], 
      backgroundColor: ['#FF6384', '#36A2EB'], 
      hoverBackgroundColor: ['#FF6384', '#36A2EB'] 
    }]
  };

  return (
    <div className="dashboard">
      {/* role이 'admin'이면 블러 없이 보이고, 그 외는 블러 처리 */}
      <div className={`entry-list-container ${role === 'ROLE_ADMIN' ? '' : 'blur'}`}>
        <InoutList /> {/* TimeTable 대신 InoutList를 사용 */}
      </div>
      <div className="flex-container">
        <div className="flex-item"> {/* Graph와 TimeVehicleChart를 감싸는 컨테이너 */}
          <Graph />
        </div>
        <div className="flex-item"> {/* 나란히 배치된 TimeVehicleChart */}
          <TimeVehicleChart options={{ responsive: true }} />
        </div>
        <VehicleTypeDoughnut data={vehicleTypeData} options={{ responsive: true }} />
        {/* 공지사항 등록 및 검색 기능을 숨김 */}
        <Notice hideControls />
      </div>
    </div>
  );
}

export default Dashboard;
