import React, { useState, useEffect } from 'react';
import '../css/inoutList.css'; // 별도의 CSS 파일을 사용할 수 있도록 설정

const WS_URL = 'ws://192.168.0.142:8080/ws';

const InoutList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // WebSocket을 통해 데이터를 가져옴
    const socket = new WebSocket(WS_URL);

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);

      // receivedData가 배열이 아닐 경우 배열로 변환
      const formattedData = Array.isArray(receivedData)
        ? receivedData.map((item, index) => ({
            id: index + 1,
            carNumber: item.carNumber || 'N/A',
            time: item.time || 'N/A',
            location: item.location || 'N/A',
            recognitionRate: item.recognitionRate || 'N/A',
            phoneNumber: item.phoneNumber || 'N/A',
          }))
        : [
            {
              id: 1,
              carNumber: receivedData.carNumber || 'N/A',
              time: receivedData.time || 'N/A',
              location: receivedData.location || 'N/A',
              recognitionRate: receivedData.recognitionRate || 'N/A',
              phoneNumber: receivedData.phoneNumber || 'N/A',
            },
          ];

      setData(formattedData);
    };

    socket.onerror = (error) => console.error('WebSocket error: ', error);
    return () => socket.close(); // 컴포넌트가 언마운트될 때 WebSocket을 닫음
  }, []);

  return (
    <div className="inout-list-container">
      {/* <h2>입출차 리스트</h2> */}
      <div className="table-wrapper">
        <table className="inout-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>차량번호</th>
              <th>시간</th>
              <th>장소</th>
              <th>인식율</th>
              <th>핸드폰번호</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.carNumber}</td>
                  <td>{row.time}</td>
                  <td>{row.location}</td>
                  <td>{row.recognitionRate}</td>
                  <td>{row.phoneNumber}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InoutList;
