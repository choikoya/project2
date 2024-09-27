import React, { useState, useEffect } from 'react';
import '../css/notice.css';

function Message({ hideControls = false }) {
  const [messages, setMessages] = useState([]); // 쪽지 목록 상태 관리

  // 서버에서 쪽지 목록을 가져오는 함수
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 인증 토큰 가져오기

      // 백엔드로 GET 요청 보내기 (인증 토큰 포함)
      const response = await fetch('http://192.168.0.142:8080/member/message', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰 포함
          'Content-Type': 'application/json',
        },
      });

      // 응답 처리
      if (response.ok) {
        const data = await response.json();
        setMessages(data); // 서버로부터 받은 쪽지 데이터를 상태에 저장
      } else {
        console.error('쪽지를 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchMessages(); // 컴포넌트가 마운트되면 쪽지 데이터를 가져옴
  }, []);

  return (
    <div className="message-container">
      
      <div className="message-list">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={message.messageId} className="message-item">
              <div>
                <strong>내용:</strong> {message.content}
              </div>
              <div>
                <strong>보낸이:</strong> 관리자
              </div>
              <div>
                <strong>보낸 날짜:</strong> {new Date(message.createDate).toLocaleDateString()}
              </div>
              <hr /> {/* 각 쪽지 아래에 구분선을 추가 */}
            </div>
          ))
        ) : (
          <p>새로운 쪽지가 없습니다.</p>
        )}
      </div>
      
    </div>
  );
}

export default Message;
