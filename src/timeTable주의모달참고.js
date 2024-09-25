import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './timeTable.css';
import Modal from 'react-modal'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const WS_URL = 'ws://192.168.0.142:8080/ws'; 
Modal.setAppElement('#root'); 

function parseDateFromName(name) {
  if (!name || typeof name !== 'string') {
    console.error('Invalid name:', name);
    return null;
  }
  const match = name.match(/(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})-(\d{2})/);
  if (!match) {
    console.error('No match found for:', name);
    return null;
  }
  const [_, datePart, hours, minutes, seconds] = match;
  const [year, month, day] = datePart.split('-');
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

function sortImages(images, key) {
  return images.sort((a, b) => {
    const dateA = parseDateFromName(a[key]);
    const dateB = parseDateFromName(b[key]);
    if (dateA === null && dateB === null) return 0;
    if (dateA === null) return 1;
    if (dateB === null) return -1;
    return dateA - dateB;
  });
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
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [messageModalIsOpen, setMessageModalIsOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');

  useEffect(() => {
    fetchData(); 

    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(intervalId); 
  }, []);

  const fetchData = async () => {
    const socket = new WebSocket(WS_URL);
  
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.inputImages && data.outputImages) {
          const sortedInputImages = sortImages(data.inputImages, 'weighbridgename');
          const sortedOutputImages = sortImages(data.outputImages, 'junkyardname');
          const mergedImages = [...sortedInputImages, ...sortedOutputImages];
          setAllData(mergedImages);
        } else {
          console.error("Unexpected data format:", data);
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  };

  const handleSearch = () => {
    const startDateObj = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
    const endDateObj = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;

    const filtered = allData.filter(row => {
      const rowDateStr = parseDateFromName(row.weighbridgename || row.junkyardname);
      const rowDateObj = new Date(rowDateStr);

      const isDateInRange = (!startDateObj || !endDateObj || (rowDateObj >= startDateObj && rowDateObj <= endDateObj));
      const isVehicleMatch = !vehicleNumber || row.fullnumber.includes(vehicleNumber);
      const isLocationMatch = !locationFilter || row.place.includes(locationFilter);

      return (startDate || endDate) ? (isDateInRange && isVehicleMatch && isLocationMatch) : (isVehicleMatch && isLocationMatch);
    });

    setFilteredData(filtered);
    setCurrentPage(1); 
  };

  const openModal = (row) => {
    setSelectedRow(row);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('content', messageContent); 
      formData.append('fullnumber', selectedRow.fullnumber);

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

  const currentData = (filteredData.length > 0 ? filteredData : allData).slice((currentPage - 1) * dataPerPage, currentPage * dataPerPage);
  const totalPages = Math.ceil((filteredData.length > 0 ? filteredData.length : allData.length) / dataPerPage);

  return (
    <div className="time-table-container">
      <h2>입출차 차량 조회</h2>

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
            <th>쪽지</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * dataPerPage + index + 1}</td>
                <td style={{ cursor: 'pointer', color: 'blue' }} onClick={() => openModal(row)}>
                  {row.fullnumber}
                </td>
                <td>
                  {
                    row.weighbridgename 
                      ? parseDateFromName(row.weighbridgename)?.toLocaleString() 
                      : row.junkyardname 
                      ? parseDateFromName(row.junkyardname)?.toLocaleString() 
                      : 'Invalid Date'
                  }
                </td>
                <td>{row.place}</td>
                <td>{row.recognize}</td>
                <td>{row.cartype}</td>
                <td>
                 <button onClick={() => {
                          setSelectedRow(row);  
                          setMessageModalIsOpen(true);  
                }} className="message-button">
                  <FontAwesomeIcon icon={faEnvelope} />
                 </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} onClick={() => handlePageChange(i + 1)} className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}>
            {i + 1}
          </button>
        ))}
      </div>

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>차량 정보 수정</h2>
        {selectedRow ? (
          <img
            src={`http://192.168.0.142:8080/image/${selectedRow.name}`} // 이미지 URL
            alt="참고 이미지"
            style={{ maxWidth: '100%', height: 'auto' }} // 이미지 스타일
          />
        ) : (
          <p>참고 이미지 없음</p>
        )}
        <form onSubmit={(e) => { e.preventDefault(); /* handleSubmit 추가 필요 */ }}>
          <label>
            차량번호
            <input
              type="text"
              name="fullnumber"
              value={selectedRow?.fullnumber || ''}
              readOnly
            />
          </label>
          <label>
            장소
            <input
              type="text"
              name="place"
              value={selectedRow?.place || ''}
              readOnly
            />
          </label>
          <button type="submit">저장</button>
          <button type="button" onClick={closeModal}>취소</button>
        </form>
      </Modal>

      <Modal isOpen={messageModalIsOpen} onRequestClose={() => setMessageModalIsOpen(false)}>
        <h2>메시지 보내기</h2>
        <textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="메시지 내용 입력"
          className="modal-textarea"
        />
        <div className="modal-buttons">
          <button onClick={handleSendMessage}>전송</button>
          <button onClick={() => setMessageModalIsOpen(false)}>취소</button>
        </div>
      </Modal>
    </div>
  );
};

export default TimeTable;

