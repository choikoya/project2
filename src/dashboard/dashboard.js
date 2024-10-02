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
import { FaChartLine, FaSearch } from 'react-icons/fa';

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

      {/* 첫 번째 flex-container */}
      <div className="flex-container">
        <div className="flex-item"> {/* Graph와 TimeVehicleChart를 감싸는 컨테이너 */}
          <Graph />
        </div>
        <div className="flex-item2"> {/* 나란히 배치된 TimeVehicleChart */}
          <TimeVehicleChart options={{ responsive: true }} />
        </div>
      </div>

      {/* 두 번째 flex-container2 */}
      <div className="flex-container2">
        <div className="flex-item3"> {/* 도넛 그래프 */}
          <VehicleTypeDoughnut data={vehicleTypeData} options={{ responsive: true }} />
        </div>
        <div className="flex-item4"> {/* 공지사항 게시판 */}
          <Notice hideControls />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
