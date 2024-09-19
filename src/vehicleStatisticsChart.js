import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function VehicleStatisticsChart({ options }) {
  const [chartType, setChartType] = useState('yearly'); // 'yearly', 'monthly', 'weekly'
  const [year, setYear] = useState('2024');
  const [month, setMonth] = useState('1');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch 연간 데이터
  const fetchYearlyData = async (year) => {
    const token = localStorage.getItem('authToken');
    console.log(`Fetching yearly data for year: ${year}`); // 요청 전에 로그 추가

    const response = await fetch(`http://192.168.0.142:8080/member/graph?year=${year}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = `Yearly data fetch failed: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    const data = await response.json();
    console.log('Yearly data:', data); // 응답 데이터 확인
    const labels = [`${year}`];
    const dataValues = data.map(item => Number(Object.values(item)[0]));
    return { labels, dataValues };
  };

  // Fetch 월간 데이터
  const fetchMonthlyData = async (year) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://192.168.0.142:8080/member/graph?year=${year}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = `Monthly data fetch failed: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    const data = await response.json();
    const labels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    const dataValues = data.map(item => Number(Object.values(item)[0]));
    return { labels, dataValues };
  };

  // Fetch 주간 데이터
  const fetchWeeklyData = async (year, month) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://192.168.0.142:8080/member/graph?year=${year}&month=${month}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorMessage = `Weekly data fetch failed: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    const data = await response.json();
    const dataObject = data[0];
    const labels = Array.from({ length: Object.keys(dataObject).length }, (_, i) => `${i + 1}주`);
    const dataValues = Object.values(dataObject).map(val => Number(val));
    return { labels, dataValues };
  };

  // 차트 데이터 불러오기
  const fetchData = async () => {
    setLoading(true);
    try {
      let result;
      if (chartType === 'yearly') {
        result = await fetchYearlyData(); // 인자를 제거했습니다.
      } else if (chartType === 'monthly') {
        result = await fetchMonthlyData(year);
      } else if (chartType === 'weekly') {
        result = await fetchWeeklyData(year, month);
      }

      setChartData({
        labels: result.labels,
        datasets: [
          {
            label: `${chartType === 'yearly' ? '연간' : chartType === 'monthly' ? '월간' : '주간'} 출입 차량 통계`,
            data: result.dataValues,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.4)',
            fill: true,
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [chartType, year, month]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>차량 통계</h2>

      {/* 차트 유형 선택 버튼 */}
      <div>
        <button onClick={() => setChartType('yearly')}>연간</button>
        <button onClick={() => setChartType('monthly')}>월간</button>
        <button onClick={() => setChartType('weekly')}>주간</button>
      </div>

      {/* 연도 및 월 선택 */}
      <div>
        <label>연도 선택: </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="2014"
          max="2024"
        />
        {chartType === 'weekly' && (
          <div>
            <label>월 선택: </label>
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min="1"
              max="12"
            />
          </div>
        )}
      </div>

      {/* 차트 렌더링 */}
      <Line data={chartData} options={options} />
    </div>
  );
}

export default VehicleStatisticsChart;
