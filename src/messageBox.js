import React, { useState, useEffect } from 'react';
import './notice.css';

function Message({ hideControls = false }) {
  const [messages, setMessages] = useState([]); // Current list of notices
 

  // Fetch notice list from the backend
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://192.168.0.142:8080/member/message', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('쪽지를 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);



  return (
    <div className="notice-page">
      <h2>쪽지함</h2>
    
      <table className="notice-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>내용</th>
            <th>보낸이</th>
            <th>요청날짜</th>
            
          </tr>
        </thead>
        <tbody>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <tr key={message.messageId}>
                <td>{index + 1}</td>
                <td>
                  <span
                    className="notice-title"
                  >
                    {message.content}
                  </span>
                </td>
                <td>관리자</td>
                <td>{new Date(message.createDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">쪽지가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
     
    </div>
  );
}

export default Message;