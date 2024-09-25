import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './timeTable.css';
import Modal from 'react-modal'; // Import react-modal
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

Modal.setAppElement('#root'); // Adjust if your root element has a different ID

// 테스트용 mock 데이터를 임의로 생성하여 사용하기 위한 부분
const mockData = {
  inputImages: [
    { id: 1, name: '2024-09-25_12-00-00', fullnumber: '1234AB', place: '계근장', recognize: '95%', cartype: 'Truck', ownerId: 1 },
    { id: 2, name: '2024-09-25_13-00-00', fullnumber: '5678CD', place: '고철장', recognize: '90%', cartype: 'Car', ownerId: 2 },
    // 데이터 생략
  ],
  outputImages: [
    { id: 3, name: '2024-09-25_14-00-00', fullnumber: '8765XY', place: '계근장', recognize: '85%', cartype: 'Van', ownerId: 1 },
    // 데이터 생략
  ],
};

function parseDateFromName(name) {
  const timestampStr = name.match(/(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/);
  if (!timestampStr) {
    console.error('Invalid filename format:', name);
    return new Date(0); // Return a default date in case of error
  }
  const [_, datePart, timePart] = timestampStr;
  const formattedTimePart = timePart.replace(/-/g, ':');
  return new Date(`${datePart}T${formattedTimePart}`);
}

function parseDateFromName2(name) {
  const timestampStr = name.match(/(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/);
  if (!timestampStr) {
    console.error('Invalid filename format:', name);
    return ''; 
  }
  const [_, datePart, timePart] = timestampStr;
  const formattedTimePart = timePart.replace(/-/g, ':');
  return new Date(`${datePart}T${formattedTimePart}Z`).toLocaleString('sv-SE', { timeZone: 'UTC' }).replace('T', ' ').substring(0, 19);
}

function sortImages(images) {
  return images.sort((a, b) => parseDateFromName(a.name) - parseDateFromName(b.name));
}

const TimeTable = () => {
  const [startDate, setStartDate] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const [locationFilter, setLocationFilter] = useState('');
  const [userRole, setUserRole] = useState(''); 
  const [userId, setUserId] = useState(null); 
  const [selectedRow, setSelectedRow] = useState(null);
  const [messageModalIsOpen, setMessageModalIsOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    setUserRole(role);
    setUserId(userId);
    fetchData(role, userId);

    const intervalId = setInterval(() => {
      fetchData(role, userId);
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchData = async (role, userId) => {
    const sortedInputImages = sortImages(mockData.inputImages);
    const sortedOutputImages = sortImages(mockData.outputImages);
    let mergedImages = [...sortedInputImages, ...sortedOutputImages];

    if (role === 'ROLE_USER') {
      mergedImages = mergedImages.filter(image => image.ownerId === parseInt(userId));
    }

    setAllData(mergedImages);
  };

  const handleSearch = () => {
    const startDateObj = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
    const endDateObj = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;

    const filtered = allData.filter(row => {
      const rowDateStr = parseDateFromName(row.name);
      const isDateInRange = (!startDateObj || !endDateObj || (rowDateStr >= startDateObj && rowDateStr <= endDateObj));
      const isVehicleMatch = !vehicleNumber || row.fullnumber.includes(vehicleNumber);
      const isLocationMatch = !locationFilter || row.place.includes(locationFilter); 
      return isDateInRange && isVehicleMatch && isLocationMatch;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleOpenMessageModal = (row) => {
    setSelectedRow(row);
    setMessageModalIsOpen(true); 
  };

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('authToken'); // 인증 토큰 가져오기

      const formData = new FormData();
      formData.append('content', messageContent); 
      formData.append('fullnumber', selectedRow.fullnumber); 
      console.log(messageContent,selectedRow.fullnumber );

      const response = await fetch('http://192.168.0.142:8080/admin/message', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData, 
      });

      if (response.ok) {
        alert('메시지가 성공적으로 전송되었습니다.');
        setMessageModalIsOpen(false); 
      } else {
        alert('메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = (filteredData.length > 0 ? filteredData : allData).slice(indexOfFirstData, indexOfLastData);
  const totalPages = Math.ceil((filteredData.length > 0 ? filteredData.length : allData.length) / dataPerPage);

  return (
    <div className="time-table-container">
      <h2>입출차 차량 조회</h2>

      <div className="search-controls">
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
            {userRole === 'ROLE_ADMIN' && <th>주의</th>} {/* 관리자만 '주의' 열 표시 */}
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * dataPerPage + index + 1}</td>
                <td>{row.fullnumber}</td>
                <td>{parseDateFromName2(row.name)}</td>
                <td>{row.place}</td>
                <td>{row.recognize}</td>
                <td>{row.cartype}</td>
                {userRole === 'ROLE_ADMIN' && (
                  <td>
                                        <button onClick={() => handleOpenMessageModal(row)}>
                      <FontAwesomeIcon icon={faEnvelope} />
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={userRole === 'ROLE_ADMIN' ? 7 : 6} className="table-no-data">
                선택된 조건에 해당하는 데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} onClick={() => handlePageChange(i + 1)} disabled={currentPage === i + 1}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* 쪽지 전송 모달 */}
      <Modal
        isOpen={messageModalIsOpen}
        onRequestClose={() => setMessageModalIsOpen(false)}
        contentLabel="Send Message"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>관리자 주의 메시지 전송</h2>
        <textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="message-textarea"
        />
        <div className="modal-buttons">
          <button className="send-button" onClick={handleSendMessage}>보내기</button>
          <button className="cancel-button" onClick={() => setMessageModalIsOpen(false)}>취소</button>
        </div>
      </Modal>
    </div>
  );
};

export default TimeTable;

