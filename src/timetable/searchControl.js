import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import '../css/searchControl.css';

const SearchControls = ({ 
    vehicleNumber, 
    setVehicleNumber, 
    locationFilter, 
    setLocationFilter, 
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate, 
    handleSearch,
    handleShowAll // 전체 데이터를 보여주는 콜백 함수 추가
}) => {
  // 2010년 1월 1일부터 선택 가능하도록 설정
  const minSelectableDate = new Date(2010, 0, 1);

  // 유효성 검사 메시지 상태
  const [errorMessage, setErrorMessage] = useState('');

  // 날짜 비교 후 검색 버튼 클릭 시 처리
  const onSearch = () => {
    if (endDate && startDate && endDate < startDate) {
      alert('종료 날짜가 시작 날짜보다 빠릅니다. 다시 선택해주세요.');
    } else {
      handleSearch();
    }
  };

  return (
    <div className="search-controls">
      <div className="filters">
        <input 
          type="text" 
          placeholder="차량번호로 검색" 
          value={vehicleNumber} 
          onChange={(e) => setVehicleNumber(e.target.value)} 
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
          showYearDropdown        // 년도 드롭다운 활성화
          showMonthDropdown       // 월 드롭다운 활성화
          dropdownMode="select"   // 드롭다운이 각각 보이도록 설정
          scrollableYearDropdown  // 스크롤 가능한 년도 목록
          yearDropdownItemNumber={15} // 표시할 년도의 범위
          minDate={minSelectableDate} // 2010년 1월 1일 이후만 선택 가능
          className="search-input"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy년 MM월 dd일"
          placeholderText="종료 날짜 선택"
          showYearDropdown        // 년도 드롭다운 활성화
          showMonthDropdown       // 월 드롭다운 활성화
          dropdownMode="select"   // 드롭다운이 각각 보이도록 설정
          scrollableYearDropdown  // 스크롤 가능한 년도 목록
          yearDropdownItemNumber={15} // 표시할 년도의 범위
          minDate={minSelectableDate} // 2010년 1월 1일 이후만 선택 가능
          className="search-input"
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button onClick={onSearch} className="search-button">조회</button>
      
      {/* 전체 버튼 클릭 시 handleShowAll 호출 */}
      <button onClick={handleShowAll} className="all-button">전체</button>  

    </div>
  );
};

export default SearchControls;
