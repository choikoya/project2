import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './notice.css'; // 스타일 파일 추가

function Notice() {
  // 공지사항 데이터를 관리하는 상태
  const [notices, setNotices] = useState([
    { id: 4, title: '공지사항입니다', writer: '관리자', date: '2024-09-03 12:52', views: 50, isNew: true },
    { id: 3, title: '공지사항입니다', writer: '관리자', date: '2024-09-03 12:52', views: 50, isNew: false },
    { id: 2, title: '공지사항입니다', writer: '관리자', date: '2024-09-03 12:52', views: 50, isNew: false },
    { id: 1, title: '공지사항입니다', writer: '관리자', date: '2024-09-03 12:52', views: 50, isNew: false },
  ]);

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState('');

   // 사용자가 관리자 여부를 확인하는 상태
   const [isAdmin, setIsAdmin] = useState(false);
   
   const navigate = useNavigate();

   // 페이지 로드 시 사용자 역할 확인
   useEffect(() => {
     const userRole = sessionStorage.getItem('role'); // 세션에서 사용자 역할 확인
     console.log('sessionStrorage', userRole);
     if (userRole === 'admin') {
       setIsAdmin(true); // 사용자가 관리자일 경우
     }
   }, []);

  // 공지사항 목록 필터링 (검색어가 포함된 제목)
  const filteredNotices = notices.filter((notice) =>
    notice.title.includes(searchTerm)
  );

  // 검색 입력 값 변경 처리 함수
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


   // 제목 클릭 시 상세 페이지로 이동
   const handleTitleClick = (id) => {
    navigate(`/notice/${id}`); // 특정 공지사항 ID로 이동
  };


  return (
    <div className="notice-page">
      <h2>공지사항을 조회합니다</h2>
      
      {/* 관리자인 경우에만 등록 버튼을 보여줌 */}
      {isAdmin && (
        <button className="register-button" onClick={() => navigate('/write')}>등록</button>
      )}


      {/* 공지사항 테이블 */}
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
          {filteredNotices.map((notice) => (
            <tr key={notice.id}>
              <td>{notice.id}</td>
              <td>
                {/* 제목 클릭 시 handleTitleClick 호출 */}
                <span
                className="notice-title"
                  onClick={() => handleTitleClick(notice.id)}
                  style={{ cursor: 'pointer', color: 'blue' }} // 클릭할 수 있다는 시각적 표시
                >
                 {notice.title}
                 </span> 
                {notice.isNew && <span className="new-badge">N</span>}
              </td>
              <td>{notice.writer}</td>
              <td>{notice.date}</td>
              <td>{notice.views}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 검색창 */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="검색어를 입력하세요"
        />
        <button className="search-button">검색</button>
      </div>

      
    </div>
  );
}

export default Notice;
