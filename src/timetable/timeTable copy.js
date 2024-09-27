import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SearchControl from './searchControl';
import TimeTableRow from './timeTableRow';
import VehicleEditModal from './vehicleEditModal';
import MessageModal from './messageModal';
import Pagenation from '../pagenation';
import '../css/timeTable.css';
import Modal from 'react-modal'; // Import react-modal
import { BiEnvelope } from "react-icons/bi";

const WS_URL = 'ws://192.168.0.142:8080/ws';
Modal.setAppElement('#root'); // Adjust if your root element has a different ID

// 날짜를 파일 이름에서 추출하여 변환하는 함수
const parseDateFromName = (name) => {
  if (!name || typeof name !== 'string') return null;
  const match = name.match(/(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const [_, datePart, hours, minutes, seconds] = match;
  return new Date(datePart + 'T' + hours + ':' + minutes + ':' + seconds);
};

// 파일 이름에서 날짜와 시간을 추출하는 함수
function parseDateFromName2(name) {
  if (!name || typeof name !== 'string') {
    console.error('Invalid name provided:', name);
    return ''; // Return an empty string if the name is invalid
  }

  const timestampStr = name.match(/(\d{4}-\d{2}-\d{2})_(\d{2})-(\d{2})-(\d{2})/);
  if (!timestampStr) {
    console.error('Invalid filename format:', name);
    return ''; // Return an empty string in case of error
  }

  const [_, datePart, hours, minutes, seconds] = timestampStr;
  const date = new Date(`${datePart}T${hours}:${minutes}:${seconds}Z`);
  return date.toLocaleString('sv-SE', { timeZone: 'UTC' }).replace('T', ' ').substring(0, 19);
}

const sortImages = (images, key) => {
  return images.sort((a, b) => {
    const dateA = parseDateFromName(a[key]);
    const dateB = parseDateFromName(b[key]);
    return dateA - dateB;
  });
};

// 파일 이름에서 날짜와 시간을 추출하는 함수
function extractDateFromName(name) {
  const timestampStr = name.match(/(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2}-\d{2})/);
  if (!timestampStr) return '';
  const [_, datePart, timePart] = timestampStr;
  const formattedTimePart = timePart.replace(/-/g, ':');
  return `${datePart}T${formattedTimePart}`;
}

const TimeTable = () => {

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px' // Spacing between links
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#007bff' // Adjust the color as needed
  };

  const linkHoverStyle = {
    textDecoration: 'underline'

    
  };

  const location = useLocation(); // 현재 페이지 경로를 추적
  
  const [startDate, setStartDate] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [endDate, setEndDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]); // 검색된 데이터를 저장
  const [allData, setAllData] = useState([]); // 전체 데이터를 저장
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;
  const [pageRange, setPageRange] = useState([1, 10]);
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [messageModalIsOpen, setMessageModalIsOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [secondModalIsOpen, setSecondModalIsOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({

    
    fullnumber: '',
    place: ''
  });

  // 처음 화면 로드 시 오늘 날짜에 해당하는 데이터만 필터링하는 상태 추가
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showAll, setShowAll] = useState(false); // 전체 데이터 표시 여부를 위한 상태 추가

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // 데이터를 가져오는 부분 (WebSocket을 통한 서버 연결)
  const fetchData = async () => {
    const socket = new WebSocket(WS_URL);
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const sortedInputImages = sortImages(data.inputImages, 'weighbridgename');
      const sortedOutputImages = sortImages(data.outputImages, 'junkyardname');
      const mergedImages = [...sortedInputImages, ...sortedOutputImages];
      // Sort the merged array based on the date
      const sortedMergedImages = sortImages(mergedImages);
  
      // 전체 데이터를 업데이트
      setAllData(sortedMergedImages);
  
      // 처음 로드 시 2024년 2월 1일 데이터만 필터링
      if (isFirstLoad && !showAll) {  // 처음 로드면서 전체 버튼이 눌리지 않았을 때만 실행
        const targetDate = '2024-02-01'; // 2024년 2월 1일
        const filteredByDate = sortedMergedImages.filter(row => {
          const rowDate = parseDateFromName(row.weighbridgename || row.junkyardname);
          return rowDate && rowDate.toISOString().slice(0, 10) === targetDate; // 특정 날짜만 필터링
        });
        setFilteredData(filteredByDate); // 필터된 데이터만 설정
        setIsFirstLoad(false); // 처음 로드 완료 상태로 변경
      }
      // showAll이 false일 때만 데이터 유지
      else if (!showAll) {
        setFilteredData(sortedMergedImages); // 전체 데이터를 보여주는 상황이 아니면 처음 데이터를 유지
      }
    };
    socket.onerror = (error) => console.error("WebSocket error: ", error);
    return () => socket.close();
  };
  

  

  const handleSearch = () => {
    setShowAll(false); // 전체 데이터를 비활성화
    setIsFirstLoad(true); // 첫 로드처럼 데이터를 다시 불러오게 설정

     // 필터 상태값을 초기화하여 검색 필터를 리셋
  setStartDate(null); 
  setEndDate(null); 
  setVehicleNumber('');
  setLocationFilter('');

  // 데이터를 다시 불러오는 fetchData 호출
  fetchData(); // 데이터 새로 불러오기

  // 필터링 로직 (fetchData 이후 필터된 데이터를 표시할 때 적용)

    const startDateObj = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
    const endDateObj = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
    
    const filtered = allData.filter(row => {
      const rowDate = parseDateFromName(row.weighbridgename || row.junkyardname);
      const isDateInRange = (!startDateObj || !endDateObj || (rowDate >= startDateObj && rowDate <= endDateObj));
      const isVehicleMatch = !vehicleNumber || row.fullnumber.includes(vehicleNumber);
      const isLocationMatch = !locationFilter || row.place.includes(locationFilter);
      return isDateInRange && isVehicleMatch && isLocationMatch;
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

   // 전체 데이터를 보여주는 함수
const handleShowAll = () => {
  setFilteredData(allData); // 전체 데이터를 표시
  setShowAll(true); // 전체 데이터 보기를 활성화
  setIsFirstLoad(false); // 첫 로드가 아니므로 false로 설정
  setCurrentPage(1);
  console.log('전체', allData);
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
      return; // Exit if selectRow is invalid
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
        setMembers(data); // Set members data from response
        setSecondModalIsOpen(true); // Open the modal
        console.log(data);
      } else {
        console.error('유사번호가 없습니다        .');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const closeSecondModal = () => {
    setSecondModalIsOpen(false);
    setMembers([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleOpenMessageModal = (row) => {
    setSelectedRow(row);
    setMessageModalIsOpen(true); 
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
        closeMessageModal();
      } else {
        alert('메시지 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('메시지 전송 중 오류 발생:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      console.log('FormData Place:', formData.place); // 확인을 위한 로그

      let url = '';
      if (formData.place === '계근장') {
        url = 'http://192.168.0.142:8080/admin/inout/inputImage';
      } else if (formData.place === '고철장') {
        url = 'http://192.168.0.142:8080/admin/inout/outputImage';
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
          id: selectedRow.id, // 선택된 행의 ID
          fullnumber: formData.fullnumber, // 폼에서 입력된 차량번호
        }).toString(),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedData = await response.json();
      setAllData(allData.map(row => (row.id === selectedRow.id ? updatedData : row)));
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCellClick = (row) => {
    if (window.confirm('차량번호를 클릭하여 정보를 수정하시겠습니까?')) {
      openModal(row);
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

      <SearchControl
        vehicleNumber={vehicleNumber}
        setVehicleNumber={setVehicleNumber}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleSearch={handleSearch}
        handleShowAll={handleShowAll}  // handleShowAll 함수 추가
      />

      <table className="timeTable-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>차량번호</th>
            <th>시간</th>
            <th>장소</th>
            <th>인식율</th>
            <th>계근량</th>
            <th>주의</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, index) => (
              <TimeTableRow
                key={index}
                row={row}
                index={index}
                handleCellClick={handleCellClick}
                handleOpenMessageModal={handleOpenMessageModal}
                currentPage={currentPage}
                dataPerPage={dataPerPage}
                parseDateFromName={parseDateFromName}
              />
            ))
          ) : (
            <tr>
              <td colSpan="7" className="table-no-data">선택된 조건에 해당하는 데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagenation 
        currentPage={currentPage} 
        totalPages={totalPages} 
        pageRange={pageRange} 
        setPageRange={setPageRange} 
        setCurrentPage={setCurrentPage} 
      />

      <VehicleEditModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        selectedRow={selectedRow}
        formData={formData}
        handleChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handleSubmit={handleSubmit}
        openSecondModal={openSecondModal}
      />

      <MessageModal
        isOpen={messageModalIsOpen}
        onRequestClose={closeMessageModal}
        messageContent={messageContent}
        setMessageContent={setMessageContent}
        handleSendMessage={handleSendMessage}
      />

      <Modal
        isOpen={secondModalIsOpen}
        onRequestClose={closeSecondModal}
        contentLabel="Additional Information"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>추가 정보(유사번호 리스트)</h2>
        <p>{members.map((member, i) => <span key={i}>{member.name} </span>)}</p>
        <button type="button" onClick={closeSecondModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default TimeTable;

