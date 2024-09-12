import React, { useState, useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import './notice.css'; // 스타일 파일 추가

function Notice() {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부 상태 추가
  const [role, setRole] = useState(''); // 역할 상태 저장

  
  const navigate = useNavigate();

  // 공지사항 목록을 백엔드에서 불러오는 함수
  const fetchNotices = async () => {
    try {
      const token = localStorage.getItem('authToken'); // 인증 토큰 가져오기
      const userRole = localStorage.getItem('userRole');
      setRole(userRole);

      console.log('Fetching notices...'); // 콘솔 로그 추가

      const response = await fetch('http://192.168.0.133:8080/member/community', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        

        // 현재 날짜 기준으로 최근 7일 이내의 공지사항에 'isNew'를 true로 설정
        const currentDate = new Date();
        const updatedData = data.map((notice) => {
          const noticeDate = new Date(notice.createDate);
          const isNew = (currentDate - noticeDate) / (1000 * 60 * 60 * 24) <= 7; // 최근 7일 이내
          return { ...notice, isNew };
        });

        // 데이터를 createDate 기준으로 내림차순 정렬 (최신 글이 상단에 위치)
        const sortedData = updatedData.sort(
          (a, b) => new Date(b.createDate) - new Date(a.createDate)
        );

        setNotices(sortedData); // 공지사항 데이터를 상태에 저장
        setFilteredNotices(sortedData); // 검색 기능을 위해 복사본도 저장
        console.log('data', sortedData); // 콘솔 로그 추가
      } else {
        console.error('공지사항을 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  // 페이지 로드 시 사용자 역할 확인 및 공지사항 목록 불러오기
  useEffect(() => {
    
    console.log('useeffect');
    const userRole = localStorage.getItem('userRole');
    setIsAdmin(userRole === 'ROLE_ADMIN'); // 사용자 역할이 'admin'이면 등록 버튼을 보이게 설정

    // 공지사항 목록을 불러옴
    fetchNotices();
  }, []);

  // 검색 버튼을 눌렀을 때 검색어에 따른 필터링
  const handleSearchClick = () => {
    if (searchTerm) {
      setFilteredNotices(
        notices.filter((notice) =>
          notice.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredNotices(notices); // 검색어가 없으면 전체 공지사항을 보여줌
    }
  };

  // 제목 클릭 시 상세 페이지로 이동
  const handleTitleClick = (boardId) => {
    console.log("Clicked Notice ID:", boardId); 
    navigate(`/notice/${boardId}`);// 공지사항 ID를 통해 상세 페이지로 이동
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
            filteredNotices.map((notice, index) => (
              <tr key={notice.boardId}> {/* 고유 id로 key 설정 */}
              <td>{index + 1}</td> {/* index를 이용하여 순서 번호 부여 */}
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
                <td>{notice.member.username}</td> {/* 작성자 */}
                <td>{new Date(notice.createDate).toLocaleDateString()}</td> {/* 작성일 */}
                <td>{notice.count}</td> {/* 조회수 */}
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
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        <button className="search-button" onClick={handleSearchClick}>
          검색
        </button>
      </div>
    </div>
  );
}

export default Notice;
