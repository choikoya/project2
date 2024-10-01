import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
 
  return new Date(`${datePart}T${hours}:${minutes}:${seconds}`);
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
// 날짜와 시간을 포맷팅하는 함수
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const sortImages = (images, key) => {
  return images.sort((a, b) => {
    const dateA = parseDateFromName(a[key]);
    const dateB = parseDateFromName(b[key]);
    return dateA - dateB;
  });
};

const sortImages2 = (images, key) => {
  return images.sort((a, b) => {
    const dateA = a.weighbridgename ? parseDateFromName(a.weighbridgename) : parseDateFromName(a.junkyardname);
    const dateB = b.weighbridgename ? parseDateFromName(b.weighbridgename) : parseDateFromName(b.junkyardname);
    return dateA - dateB; // Ascending order
  });
};


// 파일 이름에서 날짜와 시간을 추출하는 함수


const TimeTable = () => {

  
  
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
  const [messageModalFormData,  setMessageModalFormData] = useState({
    fullnumber: '',
    content: ''
  });
  const [isFetching, setIsFetching] = useState(false);
  const [showAll, setShowAll] = useState(false); // 전체 데이터 표시 여부를 위한 상태 추가

  const [todayData, setTodayData ] =useState(false);  //하나씩 슬라이싱을 하기 위한 


// 기존 데이터 설정하지 않고 한줄씩 추가하는 로직에서 데이터만 추가하는 식으로 수정
const handleUserFetch = async () => {
    try {
        const role =localStorage.getItem('userRole');
        let url;
        if (role ==="ROLE_MEMBER") {url = 'http://192.168.0.142:8080/member/inout'} 
        else if (role ==="ROLE_ADMIN")    {url = 'http://192.168.0.142:8080/admin/today_inout' ; setTodayData(true);} 
        const token = localStorage.getItem('authToken');

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('데이터 가져오기 실패: ' + response.statusText);
        }

        const data = await response.json();
        const sortedInputImages = sortImages(data.inputImages, 'weighbridgename');
        const sortedOutputImages = sortImages(data.outputImages, 'junkyardname');
        const mergedImages = [...sortedInputImages, ...sortedOutputImages];
        const sortedMergedImages = sortImages2(mergedImages);
        console.log(sortedMergedImages)
         // 한 줄씩 데이터를 추가
    fetchDataWithIncrementalLoad(sortedMergedImages); // 한 줄씩 출력
    } catch (error) {
        console.error('입출차 데이터 가져오기 중 오류:', error.message);
        alert('데이터 가져오는 중 오류가 발생했습니다: ' + error.message);
    }
};

useEffect(() => {
  handleUserFetch();
}, []);

// Separate effect to reset current page when allData changes
useEffect(() => {
  if (allData.length > 0) {
    setCurrentPage(1);
  }
}, [allData]);

const handleSearch = () => {
  if (startDate == null && endDate == null && vehicleNumber == null && locationFilter == null) {
    setFilteredData(allData);
    return;
  }

  const startDateObj = startDate ? new Date(formatDate(startDate)) : null;
  const endDateObj = endDate ? new Date(formatDate(endDate)) : null;

  if (endDateObj) {
    endDateObj.setHours(23);
    endDateObj.setMinutes(59);
    endDateObj.setSeconds(59);
  }

  const filtered = allData.filter(row => {
    const rowDate = parseDateFromName2(row.weighbridgename || row.junkyardname);
    const rowDateObj = rowDate ? new Date(rowDate) : null;

    const isDateInRange = (!startDate && !endDate) || 
                          (!startDateObj || !rowDateObj || (rowDateObj >= startDateObj && rowDateObj <= endDateObj));

    const isVehicleMatch = !vehicleNumber || (row.fullnumber && row.fullnumber.includes(vehicleNumber));
    const isLocationMatch = !locationFilter || (row.place && row.place.includes(locationFilter));

    return isDateInRange && isVehicleMatch && isLocationMatch;
  });

  setFilteredData(filtered);
};



// 데이터를 한 줄씩 추가하는 로직 (한 번에 모든 데이터가 출력되지 않도록)
const fetchDataWithIncrementalLoad = (sortedMergedImages) => {
  let index = 0; // 인덱스 초기화
  const intervalId = setInterval(() => {
    if (index < sortedMergedImages.length) {
      setFilteredData((prevData) => [...prevData, sortedMergedImages[index]]);
      index++; // 다음 데이터를 위해 인덱스 증가
    } else {
      clearInterval(intervalId); // 모든 데이터가 출력되면 인터벌 종료
    }
  }, 3000); // 2초 간격으로 데이터를 한 줄씩 추가
};

// 데이터를 가져오는 함수 수정
const fetchData = async () => {
  const socket = new WebSocket(WS_URL);
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const sortedInputImages = sortImages(data.inputImages, 'weighbridgename');
    const sortedOutputImages = sortImages(data.outputImages, 'junkyardname');
    const mergedImages = [...sortedInputImages, ...sortedOutputImages];
    const sortedMergedImages = sortImages2(mergedImages);

    // 한 줄씩 데이터를 추가하는 함수 호출
    fetchDataWithIncrementalLoad(sortedMergedImages);
  };

  socket.onerror = (error) => console.error("WebSocket error: ", error);
  return () => socket.close();
};

// useEffect 수정: 페이지가 처음 열릴 때 데이터 로드
useEffect(() => {
  fetchData();
}, []); // 페이지가 열렸을 때만 한 번 실행




   // 전체 데이터를 보여주는 함수
   const handleShowAll = async () => {
    
   
    setIsFetching(true); // Start fetching
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://192.168.0.142:8080/admin/inout', {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          }
      });

      if (!response.ok) {
          throw new Error('데이터 가져오기 실패: ' + response.statusText);
      }

      const data = await response.json();
      console.log("2020~2024 모든 데이터" ,data)
      const sortedInputImages = sortImages(data.inputImages, 'weighbridgename');
      const sortedOutputImages = sortImages(data.outputImages, 'junkyardname');
      const mergedImages = [...sortedInputImages, ...sortedOutputImages];
      const sortedMergedImages = sortImages2(mergedImages);
      console.log(sortedMergedImages)
      setAllData(sortedMergedImages);
      setShowAll(true); // 전체 데이터 보기를 활성화
      setCurrentPage(1);
  } catch (error) {
      console.error('입출차 데이터 가져오기 중 오류:', error.message);
      alert('데이터 가져오는 중 오류가 발생했습니다: ' + error.message);
  }finally {
    setIsFetching(false); // Reset fetching state
    // Reconnect WebSocket or allow messages to be received
  }

    
  };

  const openModal = (row) => {
    setSelectedRow(row);
    setFormData({ recognize: row.recognize, fullnumber: row.fullnumber, place: row.place });
    setModalIsOpen(true);
};

const closeModal = () => {
    setModalIsOpen(false);
    setFormData({ fullnumber: '', place: '' }); // 상태 초기화
};

  const openMessageModal = (fullnumber) => {
    setMessageModalFormData({ fullnumber });
    setMessageModalIsOpen(true);
  };

  const closeMessageModal = () => {
    setMessageModalIsOpen(false);
  };

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('content', messageContent);
      formData.append('fullnumber', messageModalFormData.fullnumber);
      console.log(messageContent)
      console.log(messageModalFormData.fullnumber)
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
          id: selectedRow.numberplatename  , // 선택된 행의 ID
          fullnumber: formData.fullnumber, // 폼에서 입력된 차량번호
        }).toString(),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedData = await response.json();

      const updatedDataIndex = allData.findIndex(row => row.numberplatename === selectedRow.numberplatename);

    if (updatedDataIndex !== -1) {
    const updatedDataArray = [...allData]; // Create a shallow copy of the array
    updatedDataArray[updatedDataIndex] = updatedData; // Update the found item
    setAllData(updatedDataArray); // Set the new array
  } else {
    console.error('Item not found for update');
  }

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
        handleShowAll={handleShowAll}
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
            <th>쪽지</th>
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
                        <td>
                            {row.weighbridgename ? parseDateFromName2(row.weighbridgename) : parseDateFromName2(row.junkyardname)}
                        </td>
                        <td>{row.place}</td>
                        <td>{row.recognize}</td>
                        <td>{row.cartype}</td>
                        <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '44.8px' }} >
                         <BiEnvelope onClick={() => openMessageModal(row.fullnumber)} />
                       </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={7}>No data available</td> {/* 데이터가 없을 때 메시지 */}
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

     
   {/* 모달창 */}
      
       
   <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Vehicle"
        className="modal"
        overlayClassName="modal-overlay"
      >
       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
 

  {selectedRow ? (
    <img
      src={`http://localhost:8080/image/${selectedRow.weighbridgename ? selectedRow.weighbridgename : selectedRow.junkyardname}`}
      alt="참고 이미지"
      style={{ maxWidth: '100%', maxHeight: '200px', height: 'auto', width: 'auto' }}
    />
  ) : (
    <p>참고 이미지 없음</p>
  )}

  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
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

    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
      <button type="submit">수정</button>
      <button type="button" onClick={closeModal}>취소</button>
      <button type="button" onClick={() => openSecondModal(selectedRow)}>추가 정보 보기</button>
    </div>
  </form>
</div>

      </Modal>
    

      <Modal
          isOpen={secondModalIsOpen}
          onRequestClose={closeSecondModal}
          contentLabel="Additional Information"
          className="modal"
          overlayClassName="modal-overlay"
        >
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <h2 style={{ marginBottom: '10px' }}>추가 정보(유사번호 리스트)</h2>
              
              {members.map((member, index) => (
                <p key={index} style={{ margin: '0' }}>{member}</p>
              ))}

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
                <button type="button" onClick={closeSecondModal}>닫기</button>
              </div>
            </div>
      </Modal>


      <MessageModal
        isOpen={messageModalIsOpen}
        onRequestClose={closeMessageModal}
        messageContent={messageContent}
        setMessageContent={setMessageContent}
        handleSendMessage={handleSendMessage}
      />


    </div>
  );
};

export default TimeTable;