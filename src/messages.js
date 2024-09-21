import React, { useEffect, useState } from 'react';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://서버주소/api/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      setMessages(data.messages); // 서버로부터 쪽지 리스트 받기
    };

    fetchMessages();
  }, []);

  return (
    <div>
      <h2>쪽지함</h2>
      <ul>
        {messages.length > 0 ? (
          messages.map((message) => (
            <li key={message.id}>
              <p>{message.content}</p>
              <small>{message.sentAt}</small>
            </li>
          ))
        ) : (
          <p>새로운 쪽지가 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default Messages;
