//연결전.
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './notice.css'; // 스타일 파일 추가

function Notice() {
  // 공지사항 데이터를 관리하는 상태
  const [notices, setNotices] = useState([
    { id: 4, title: '공지사항입니다', writer: '관리자', date: '2024-09-03 12:52', views: 50, isNew: true },
    { id: 3, title: '중요 공지사항입니다', writer: '관리자', date: '2024-09-02 10:30', views: 20, isNew: false },
    { id: 2, title: '이벤트 안내', writer: '관리자', date: '2024-09-01 15:15', views: 100, isNew: false },
    { id: 1, title: '업데이트 공지', writer: '관리자', date: '2024-08-31 09:45', views: 75, isNew: false },
  ]);

  // 검색어 상태 관리
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNotices, setFilteredNotices] = useState(notices);

  // 사용자가 관리자 여부를 확인하는 상태
  const [isAdmin, setIsAdmin] = useState(true);

  const navigate = useNavigate();

  // 페이지 로드 시 사용자 역할 확인
  useEffect(() => {
    const userRole = localStorage.getItem('userRole'); // 세션에서 사용자 역할 확인
    console.log('localStrorage', userRole);
    if (userRole === 'admin') {
      setIsAdmin(true); // 사용자가 관리자일 경우
    }
  }, []);

  // 검색 입력 값 변경 처리 함수 (버튼을 눌렀을 때만 필터링)
  const handleSearchClick = () => {
    if (searchTerm) {
      setFilteredNotices(
        notices.filter((notice) =>
          // notice.title.includes(searchTerm) //대소문자 구분하여 비교
          notice.title.toLowerCase().includes(searchTerm.toLowerCase()) // 대소문자 구분 없이 비교
        )
      );
    } else {
      setFilteredNotices(notices); // 검색어가 없으면 전체 공지사항을 보여줌
    }
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
        <button className="register-button" onClick={() => navigate('/write')}>
          등록
        </button>
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
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <tr key={notice.id}>
                <td>{notice.id}</td>
                <td>
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
            ))
          ) : (
            <tr>
              <td colSpan="5">검색 결과가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 검색창 */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // 검색어 입력만 반영
          placeholder="검색어를 입력하세요"
        />
        <button className="search-button" onClick={handleSearchClick}>검색</button>
      </div>
    </div>
  );
}

export default Notice;
