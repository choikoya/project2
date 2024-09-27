import React, { useState } from 'react';
import YearlyLineChart from './yearlyLineChart';
import MonthlyLineChart from './monthlyLineChart';
import WeeklyLineChart from './weeklyLineChart';
import DailyLineChart from './dailyLineChart';
import '../css/chartStyles.css'; // CSS 파일 추가

function Graph() {
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('1');
  const [day, setDay] = useState('1');
  const [activeChart, setActiveChart] = useState('yearly'); // 활성화된 차트

  return (
    <div className="graph-container">
      {/* 버튼들 */}
      <div className="button-container">
        <button className={`chart-button ${activeChart === 'yearly' ? 'active' : ''}`} onClick={() => setActiveChart('yearly')}>
          연간
        </button>
        <button className={`chart-button ${activeChart === 'monthly' ? 'active' : ''}`} onClick={() => setActiveChart('monthly')}>
          월간
        </button>
        <button className={`chart-button ${activeChart === 'weekly' ? 'active' : ''}`} onClick={() => setActiveChart('weekly')}>
          주간
        </button>
        
      </div>

      {/* 연간 차트 */}
      {activeChart === 'yearly' && (
        <div>
          <input
            type="number"
            className="input-box"
            placeholder="년 입력"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <YearlyLineChart year={year} />
        </div>
      )}

      {/* 월간 차트 */}
      {activeChart === 'monthly' && (
        <div>
          <input
            type="number"
            className="input-box"
            placeholder="년 입력"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <MonthlyLineChart year={year} />
        </div>
      )}

      {/* 주간 차트 */}
      {activeChart === 'weekly' && (
        <div>
          <input
            type="number"
            className="input-box"
            placeholder="년 입력"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            type="number"
            className="input-box"
            placeholder="월 입력"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <WeeklyLineChart year={year} month={month} />
        </div>
      )}

      {/* 일일 차트 */}
      {activeChart === 'daily' && (
        <div className="graph-item">
          <input
            type="number"
            className="input-box"
            placeholder="년 입력"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <input
            type="number"
            className="input-box"
            placeholder="월 입력"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <input
            type="number"
            className="input-box"
            placeholder="일 입력"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          />
          <DailyLineChart year={year} month={month} day={day} />
        </div>
      )}
    </div>
  );
}

export default Graph;
