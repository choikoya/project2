import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/notice.css';

function Notice({ hideControls = false }) {
  const [notices, setNotices] = useState([]); // Current list of notices
  const [originalNotices, setOriginalNotices] = useState([]); // Store original notices
  const [searchTerm, setSearchTerm] = useState(''); // State for input value
  const navigate = useNavigate();

  // Fetch notice list from the backend
  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://192.168.0.142:8080/member/community', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotices(data);
        setOriginalNotices(data); // Store the original list
      } else {
        console.error('공지사항을 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleTitleClick = (boardId) => {
    navigate(`/notice/${boardId}`);
  };

  const searchButton = async (term) => {
    if (!term) {
      alert('검색어를 입력하세요.');
      setNotices(originalNotices); // Reset to original notices
      return; // Do not proceed with search if no term
    }

    console.log("Search term:", term);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://192.168.0.142:8080/member/community/search?fullnumber=${term}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotices(data);
        if (data.length === 0) {
          alert('검색 결과가 없습니다.'); // Alert if no results
        }
      } else {
        console.error('공지사항을 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  return (
    <div className="notice-page">
      <h2>공지사항</h2>
      {!hideControls && (
        <button className="register-button" onClick={() => navigate('/write')}>
          등록
        </button>
      )}
      <table className="notice-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {notices.length > 0 ? (
            notices.map((notice, index) => (
              <tr key={notice.boardId}>
                <td>{index + 1}</td>
                <td>
                  <span
                    className="notice-title"
                    onClick={() => handleTitleClick(notice.boardId)}
                    style={{ cursor: 'pointer', color: 'blue' }}
                  >
                    {notice.title}
                  </span>
                  {notice.isNew && <span className="new-badge">N</span>}
                </td>
                <td>{notice.member.username}</td>
                <td>{new Date(notice.createDate).toLocaleDateString()}</td>
                <td>{notice.count}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">공지사항이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
      {!hideControls && (
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="검색어를 입력하세요"
            value={searchTerm} // Bind input value to state
            onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
          />
          <button 
            className="search-button" 
            onClick={() => searchButton(searchTerm)} // Pass state variable to the function
          >
            검색
          </button>
        </div>
      )}
    </div>
  );
}

export default Notice;