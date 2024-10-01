import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/inoutList.css';

const WS_URL = 'ws://192.168.0.142:8080/ws';

const InoutList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('토큰이 없습니다. 로그인을 먼저 해주세요.');
      navigate('/');
      return;
    }

    const socket = new WebSocket(WS_URL);

    const fetchPhoneNumber = async (fullnumber) => {
      try {
        const response = await fetch(`http://192.168.0.142:8080/admin/phoneNumber?fullnumber=${fullnumber}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('네트워크 오류');
        }

        const phoneNumber = await response.text(); // Get the raw response as text
        return phoneNumber; // Return the phone number directly

      } catch (error) {
        console.error('폰 번호 가져오기 오류:', error);
        return 'N/A'; // 오류 발생 시 기본값
      }
    };

    const handleMessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("data", data);

      if (data.inputImages && data.outputImages) {
        const formattedData = await Promise.all(data.inputImages.map(async (item, index) => {
          const phoneNumber = await fetchPhoneNumber(item.fullnumber); // 폰 번호 가져오기
          return {
            id: index + 1,
            carNumber: item.fullnumber || 'N/A',
            weighbridgeName: item.weighbridgename ? item.weighbridgename.split('.')[0] : 'N/A',
            location: item.place || 'N/A',
            time: item.numberplatename.split('_').slice(0, 2).join('_') || 'N/A',
            location2: "고철장",
            phone: phoneNumber, // 가져온 폰 번호
          };
        }));

        setData(formattedData);
      } else {
        setData([]);
      }
      setLoading(false);
    };

    socket.onmessage = handleMessage;
    socket.onerror = (error) => console.error('WebSocket error: ', error);

    const intervalId = setInterval(() => {
      socket.send('REQUEST_DATA');
    }, 3600000);

    return () => {
      clearInterval(intervalId);
      socket.onmessage = null;
      socket.close();
    };
  }, [navigate]);

  return (
    <div className="inout-list-container">
      <div className="table-wrapper">
        <table className="inout-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>차량번호</th>
              <th>시간</th>
              <th>장소</th>
              <th>시간</th>
              <th>장소</th>
              <th>핸드폰번호</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">로딩 중...</td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.carNumber}</td>
                  <td>{row.weighbridgeName}</td>
                  <td>{row.location}</td>
                  <td>{row.time}</td>
                  <td>{row.location2}</td>
                  <td>{row.phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InoutList;