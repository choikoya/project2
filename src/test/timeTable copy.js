import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './timeTable.css';
import Modal from './modal';

const TimeTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [carNumberFilter, setCarNumberFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [newCarNumber, setNewCarNumber] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nextId, setNextId] = useState(1); // ID는 1부터 시작
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [dataPerPage] = useState(10); // 페이지당 데이터 수

  // 랜덤 차량번호 생성
  const generateRandomCarNumber = () => {
    const carLetters = ['가', '나', '다', '라', '마'];
    const randomLetter = carLetters[Math.floor(Math.random() * carLetters.length)];
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 1000~9999
    return `${randomLetter}${randomNumber}`;
  };

  // 서버에서 데이터를 계속해서 가져오는 함수
  const fetchData = async () => {
    try {
      const newDummyData = {
        id: nextId, // 새로운 ID 부여
        carNumber: generateRandomCarNumber(), // 랜덤 차량번호 생성
        inTime: new Date(),
        recognitionRate: Math.floor(80 + Math.random() * 20), // 80%~100% 범위의 랜덤 값
        location: Math.random() > 0.5 ? '계근대' : '고철장', // 계근대 또는 고철장 랜덤 선택
        weight: Math.floor(1000 + Math.random() * 500), // 1000kg~1500kg 범위의 무작위 값
      };

      setAllData(prevData => [...prevData, newDummyData]); // 데이터 계속 쌓이게
      setNextId(nextId + 1); // 다음 데이터에 부여할 ID 증가
    } catch (error) {
      console.error('데이터 가져오기 오류: ', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchData, 3000); // 5초마다 새로운 데이터 가져오기
    return () => clearInterval(intervalId); // 컴포넌트가 언마운트되면 정리
  }, [nextId]);

  // 조회 버튼을 눌렀을 때 필터링된 데이터를 설정하는 함수
  const handleSearch = () => {
    let filtered = allData;

    if (carNumberFilter) {
      filtered = filtered.filter(row =>
        row.carNumber.includes(carNumberFilter)
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(row =>
        row.location.includes(locationFilter)
      );
    }

    if (startDate && endDate) {
      filtered = filtered.filter(
        row => new Date(row.inTime) >= startDate && new Date(row.inTime) <= endDate
      );
    }

    setFilteredData(filtered);
  };

  // 현재 페이지에 맞는 데이터 가져오기
  const getCurrentPageData = () => {
    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    return allData.slice(indexOfFirstData, indexOfLastData); // 해당 페이지의 데이터만 반환
  };

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // 차량번호 클릭 시 모달창 열기
  const handleCarNumberClick = (row) => {
    setSelectedCar(row);
    setNewCarNumber(row.carNumber);
    setIsModalOpen(true);
  };

  // 차량번호 수정 후 저장
  const handleSave = async () => {
    try {
      const updatedCar = { ...selectedCar, carNumber: newCarNumber };
      setAllData(allData.map(car => (car.id === selectedCar.id ? updatedCar : car)));
      setFilteredData(filteredData.map(car => (car.id === selectedCar.id ? updatedCar : car)));
      setIsModalOpen(false);
    } catch (error) {
      console.error('차량번호 수정 중 오류 발생: ', error);
    }
  };

  return (
    <div className="time-table-container">
      <h2>입출차 차량 조회</h2>

      <div className="search-controls">
        <div className="filters">
          <input
            type="text"
            placeholder="차량번호로 검색"
            value={carNumberFilter}
            onChange={(e) => setCarNumberFilter(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="장소로 검색"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="datepicker-container">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy년 MM월 dd일"
            placeholderText="시작 날짜 선택"
            className="search-input"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy년 MM월 dd일"
            placeholderText="종료 날짜 선택"
            className="search-input"
          />
        </div>
        <button onClick={handleSearch} className="search-button">조회</button>
      </div>

      <table className="timeTable-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>차량번호</th>
            <th>시간</th>
            <th>장소</th>
            <th>인식율</th>
            <th>계근량</th>
          </tr>
        </thead>
        <tbody>
          {getCurrentPageData().length > 0 ? (
            getCurrentPageData().map((row, index) => (
              <tr key={index}>
                <td>{row.id}</td> {/* 실제 ID를 출력 */}
                <td style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleCarNumberClick(row)}>
                  {row.carNumber}
                </td>
                <td>{row.inTime.toLocaleString()}</td>
                <td>{row.location}</td>
                <td>{row.recognitionRate}%</td>
                <td>{row.weight}kg</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="table-no-data">선택된 조건에 해당하는 데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 버튼 */}
      <div className="pagination">
        {[...Array(Math.ceil(allData.length / dataPerPage))].map((_, i) => (
          <button key={i} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

       {/* 모달창 */}
       {isModalOpen && selectedCar && (
        <Modal
          selectedCar={selectedCar}
          newCarNumber={newCarNumber}
          setNewCarNumber={setNewCarNumber}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TimeTable;
