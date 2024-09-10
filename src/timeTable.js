import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './timeTable.css';

const TimeTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);

  // 백엔드에서 데이터를 요청하여 받아오는 함수
  const fetchData = async () => {
    try {
      const response = await fetch('https://192.168.0.133:8080/'); // 실제 API URL로 교체
      const data = await response.json();
      console.log("받아온 데이터: ", data); // 받아온 데이터 확인
      setAllData(data); // 전체 데이터를 저장
    } catch (error) {
      console.error("데이터 가져오기 오류: ", error);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 데이터를 요청
  useEffect(() => {
    fetchData();
  }, []);

  // 조회 버튼을 눌렀을 때 필터링된 데이터를 설정하는 함수
  const handleSearch = () => {
    if (startDate && !endDate) {
      // 시작 날짜만 선택되었을 때, 해당 날짜에 맞는 데이터 필터링
      const filtered = allData.filter(
        row => new Date(row.inTime).toLocaleDateString() === startDate.toLocaleDateString()
      );
      setFilteredData(filtered);
    } else if (startDate && endDate) {
      // 시작 날짜와 종료 날짜가 모두 선택된 경우, 기간 내 데이터를 필터링
      const filtered = allData.filter(
        row => new Date(row.inTime) >= startDate && new Date(row.inTime) <= endDate
      );
      setFilteredData(filtered);
    } else {
      // 날짜가 선택되지 않은 경우 빈 배열
      setFilteredData([]);
    }
  };

  return (
    <div className="time-table-container">
      <h2>차량 조회</h2>
      <div className="search-controls">
        <div className="datepicker-container">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy년 MM월 dd일"
            placeholderText="시작 날짜 선택"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy년 MM월 dd일"
            placeholderText="종료 날짜 선택"
          />
        </div>
        <button onClick={handleSearch}>조회</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>차량번호</th>
            <th>핸드폰번호</th>
            <th>입차시간</th>
            <th>출차시간</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, index) => (
              <tr key={index}>
                <td>{row.carNumber}</td>
                <td>{row.phoneNumber}</td>
                <td>{new Date(row.inTime).toLocaleString()}</td>
                <td>{new Date(row.outTime).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                선택된 날짜에 해당하는 데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTable;
