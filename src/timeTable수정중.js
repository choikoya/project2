import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './timeTable.css';
import Modal from 'react-modal'; // Import react-modal
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';



const WS_URL = 'ws://192.168.0.142:8080/ws'; // WebSocket URL로 교체
Modal.setAppElement('#root'); // Adjust if your root element has a different ID

function parseDateFromName(name) {
  const timestampStr = name.match(/(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/);
  if (!timestampStr) {
    console.error('Invalid filename format:', name);
    return new Date(0); // Return a default date in case of error
  }

  const [_, datePart, timePart] = timestampStr;
  const formattedTimePart = timePart.replace(/-/g, ':');
  const date = new Date(`${datePart}T${formattedTimePart}`);
  
  return date;
}

function parseDateFromName2(name) {
  const timestampStr = name.match(/(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/);
  if (!timestampStr) {
    console.error('Invalid filename format:', name);
    return ''; // Return an empty string in case of error
  }

  const [_, datePart, timePart] = timestampStr;
  const formattedTimePart = timePart.replace(/-/g, ':');
  const date = new Date(`${datePart}T${formattedTimePart}Z`);
  
  return date.toLocaleString('sv-SE', { timeZone: 'UTC' }).replace('T', ' ').substring(0, 19);
}

function sortImages(images) {
  return images.sort((a, b) => parseDateFromName(a.name) - parseDateFromName(b.name));
}

function extractDateFromName(name) {
  const timestampStr = name.match(/(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/);
  if (!timestampStr) {
    console.error('Invalid filename format:', name);
    return ''; 
  }

  const [_, datePart, timePart] = timestampStr;
  const formattedTimePart = timePart.replace(/-/g, ':');
  return `${datePart}T${formattedTimePart}`; 
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
  const [secondModalIsOpen, setSecondModalIsOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    fullnumber: '',
    place: ''
  });

  // New state for message modal
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
      const data = JSON.parse(event.data);
      const sortedInputImages = sortImages(data.inputImages);
      const sortedOutputImages = sortImages(data.outputImages);
      const mergedImages = [...sortedInputImages, ...sortedOutputImages];
      const sortedMergedImages = sortImages(mergedImages);
      setAllData(sortedMergedImages);
    };

    socket.onerror = (error) => {
      console.error("WebSocket 오류: ", error);
    };

    return () => {
      socket.close();
    };
  };

  const handleSearch = () => {
    const startDateObj = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
    const endDateObj = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;

    const filtered = allData.filter(row => {
      const rowDateStr = extractDateFromName(row.name);
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
    setFormData({ recognize: row.recognize, fullnumber: row.fullnumber, place: row.place });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const closeMessageModal = () => {
    setMessageModalIsOpen(false);
  };

  const openSecondModal = async (selectRow) => {
    if (!selectRow) {
      console.error('No row selected');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://192.168.0.142:8080/admin/member?fullnumber=${selectRow.fullnumber}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMembers(data);
        setSecondModalIsOpen(true);
      } else {
        console.error('유사번호가 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const closeSecondModal = () => {
    setSecondModalIsOpen(false);
    setMembers([]);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('authToken'); // 인증 토큰 가져오기
      const response = await fetch('http://192.168.0.142/api/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedRow.userId, // 선택된 사용자의 ID
          messageContent: messageContent, // 입력된 메시지 내용
        }),
      });

      if (response.ok) {
        console.log('Message sent successfully');
        closeMessageModal(); // 메시지 전송 후 모달 닫기
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleOpenMessageModal = () => {
    setMessageModalIsOpen(true); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken'); 
      let url = '';
      if (formData.place === "계근장") {
        url = "http://192.168.0.142:8080/admin/inout/inputImage";
      } else if (formData.place === "고철장") {
        url = "http://192.168.0.142:8080/admin/inout/outputImage";
      } else {
        console.error('Invalid place value');
        return;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          id: selectedRow.id, 
          fullnumber: formData.fullnumber, 
        }).toString(),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedData = await response.json();
      setAllData(allData.map(row =>
        row.id === selectedRow.id ? updatedData : row
      ));
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle cell click
  const handleCellClick = (row) => {
    if (window.confirm('차량번호를 클릭하여 정보를 수정하시겠습니까?')) {
      openModal(row);
    }
  };

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = (filteredData.length > 0 ? filteredData : allData).slice(indexOfFirstData, indexOfLastData);
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
            <th>주의</th> {/* 쪽지함 열 추가 */}
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * dataPerPage + index + 1}</td> {/* 페이지네이션 반영 인덱스 출력 */}
                <td style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleCellClick(row)}>
                  {row.fullnumber}
                </td>
                <td>{parseDateFromName2(row.name)}</td>
                <td>{row.place}</td>
                <td>{row.recognize}</td>
                <td>{row.cartype}</td>
                <td>
                  <button onClick={handleOpenMessageModal}>
                  <FontAwesomeIcon icon={faEnvelope} />

                  </button> {/* 주의 버튼 추가 */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="table-no-data">선택된 조건에 해당하는 데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 버튼 렌더링 */}
      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} onClick={() => handlePageChange(i + 1)} disabled={currentPage === i + 1}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* 차량 정보 수정 모달 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Vehicle"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>차량 정보 수정</h2>
        {selectedRow ? (
          <img
            src={`http://192.168.0.142:8080/image/${selectedRow.name}`} // 이미지 URL
            alt="참고 이미지"
            style={{ maxWidth: '100%', height: 'auto' }} // 이미지 스타일
          />
        ) : (
          <p>참고 이미지 없음</p> // 선택되지 않았을 때 보여줄 내용
        )}
        <form onSubmit={handleSubmit}>
          <label>
            차량번호
            <input
              type="text"
              name="fullnumber"
              value={formData.fullnumber}
              onChange={handleChange}
            />
          </label>
          <label>
            장소
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
            />
          </label>
          <button type="submit">저장</button>
          <button type="button" onClick={closeModal}>취소</button>
          <button type="button" onClick={() => openSecondModal(selectedRow)}>추가 정보 보기</button>
        </form>
      </Modal>

      {/* 추가 정보 모달 */}
      <Modal
        isOpen={secondModalIsOpen}
        onRequestClose={closeSecondModal}
        contentLabel="Additional Information"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>추가 정보(유사번호 리스트)</h2>
        <p>{members}</p>
        <button type="button" onClick={closeSecondModal}>닫기</button>
      </Modal>

      {/* 쪽지 전송 모달 */}
      <Modal
        isOpen={messageModalIsOpen}
        onRequestClose={closeMessageModal}
        contentLabel="Send Message"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>관리자 주의 메시지 전송</h2>
        <textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={handleSendMessage}>보내기</button>
        <button onClick={closeMessageModal}>취소</button>
      </Modal>
    </div>
  );
};

export default TimeTable;
