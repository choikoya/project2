import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 추가
import './header.css';  // 헤더에 대한 별도 CSS

function Header() {
  // 로그인 상태를 관리하는 상태 변수 (초기값은 false로 설정)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  
  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // 세션 스토리지에서 토큰 확인
    if (token) {
      setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
    }
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('authToken'); // 토큰 삭제
    setIsLoggedIn(false); // 로그아웃 상태로 전환
    navigate('/'); // 로그아웃 후 홈으로 이동
  };





  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
        <li><Link to="/notice">공지사항</Link></li>
          <li><Link to="/dashboard">대시보드</Link></li>
          <li><Link to="/result">모니터링</Link> {/* 번호판 분석 클릭 시 /upload로 이동 */}</li>
          <li><Link to="/timetable">입출차 조회</Link></li>
          
        </ul>
      </nav>
      <div className="admin-section">
        <span><Link to="/adminPage">관리자 페이지</Link></span>

         {/* 로그인 상태에 따라 로그인/로그아웃 텍스트 변경 및 동작 처리 */}
        {isLoggedIn ? (
          <span className='nav-link logout-button' onClick={handleLogout}>로그아웃</span> // 로그아웃 처리
        ) : (
          <span><Link to="/">로그인</Link></span> // 로그인 페이지로 이동
        )}
      </div>
    </header>
  );
}

export default Header;