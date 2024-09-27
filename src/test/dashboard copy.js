import React, { useState, useEffect } from 'react';
import YearlyLineChart from './yearlyLineChart';
import MonthlyLineChart from './monthlyLineChart';
import WeeklyPieChart from './weeklyLineChart';

import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './dashboard.css';

// Chart.js 플러그인 활성화
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function Dashboard() {

  const [year, setYear] = useState('2024');
  const [year1, setYear1] = useState('2024');
  const [year2, setYear2] = useState('2024');
  const [year3, setYear3] = useState('2024');
  const [month, setMonth] = useState('1');
  const [month1, setMonth1] = useState('1');
  const [day, setDay] = useState('1');

    
  // 입출차 목록 데이터
  const [entryList, setEntryList] = useState([
    {
      carNumber: '가 1234',
      entryTime: '2024년 9월 3일 오후 1:07',
      exitTime: '2024년 9월 3일 오후 2:07',
      phoneNumber: '010-000-0000',
      
    },
    {
      carNumber: '나 5678',
      entryTime: '2024년 9월 3일 오후 1:10',
      exitTime: '2024년 9월 3일 오후 2:10',
      phoneNumber: '010-123-4567',
      
    },
    {
      carNumber: '다 9012',
      entryTime: '2024년 9월 3일 오후 1:15',
      exitTime: '2024년 9월 3일 오후 2:15',
      phoneNumber: '010-987-6543',
      
    },
    {
      carNumber: '라 3456',
      entryTime: '2024년 9월 3일 오후 1:20',
      exitTime: '2024년 9월 3일 오후 2:20',
      phoneNumber: '010-555-5555',
      
    },
  ]);


  // 출입 차량 통계 데이터 (년, 월, 주간 단위)
  const [vehicleStatisticsData, setVehicleStatisticsData] = useState({
    labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    datasets: [
      {
        label: '출입 차량 통계 (연/월/주간)',
        data: [150, 200, 250, 300, 180, 220, 400, 350, 300, 270, 320, 340],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.4)',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  // 시간별 출입 차량 현황 (당일 30분 간격)
  const [timeVehicleData, setTimeVehicleData] = useState({
    labels: ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30'],
    datasets: [
      {
        label: '시간별 출입 현황',
        data: [5, 10, 15, 8, 12, 20, 7, 9],
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.4)',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  // 차량 구분 (트럭 vs 비트럭)
  const [vehicleTypeData, setVehicleTypeData] = useState({
    labels: ['트럭', '비트럭'],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  });


  // 공지사항 데이터
  const [notices, setNotices] = useState([
    { content: '9월 넷째주 출입시간 변경', date: '2024-09-03' },
    { content: '9월 다섯째주 출입시간 변경', date: '2024-09-02' },
    { content: '10월 첫째주 출입시간 공지', date: '2024-09-01' },
  ]);

  // 차트 옵션
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '출입 차량 통계 (연간)',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '시간대',
        },
      },
      y: {
        title: {
          display: true,
          text: '차량 수',
        },
      },
    },
  };

  const doughnutOptions = {
    plugins: {
      title: {
        display: true,
        text: '차량 구분',
      },
    },
  };

  return (
    <div className="dashboard">
      

      {/* 상단 입출차 목록 */}
      <div className="entry-list">
        <h2>입출차 목록</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>차량번호</th>
              <th>입차시간</th>
              <th>출차시간</th>
              <th>핸드폰 번호</th>
              
            </tr>
          </thead>
          <tbody>
            {entryList.map((entry, index) => (
              <tr key={index}>
                <td>{entry.carNumber}</td>
                <td>{entry.entryTime}</td>
                <td>{entry.exitTime}</td>
                <td>{entry.phoneNumber}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 차트 및 공지사항 그리드 레이아웃 */}
      <div className="flex-container">
         {/* 첫 줄: 출입 차량 통계 및 시간별 출입 차량 통계 */}
  <div className="flex-item">
    <Line data={vehicleStatisticsData} options={lineOptions} />
  </div>
  <div className="flex-item">
    <Line data={timeVehicleData} options={lineOptions} />
  </div>

  {/* 두 번째 줄: 좌측 차량 구분 (작은 차트), 우측 공지사항 (넓게) */}
  <div className="flex-item small-chart">
    <Doughnut data={vehicleTypeData} options={doughnutOptions} width={200} height={200} />
  </div>
  <div className="flex-item notice-board">
    <h2>공지사항</h2>
    <ul className="notice-list">
      {notices.map((notice, index) => (
        <li key={index}>
          {notice.content} <span>{notice.date}</span>
        </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
