import React from 'react';
import { Link } from 'react-router-dom'; // Link 컴포넌트 추가
import './header.css';  // 헤더에 대한 별도 CSS

function Header() {
  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li>모니터링</li>
          <li>차량 조회</li>
          <li>
            <Link to="/upload">번호판 분석</Link> {/* 번호판 분석 클릭 시 /upload로 이동 */}
          </li>
          <li>공지사항</li>
        </ul>
      </nav>
      <div className="admin-section">
        <span>관리자 페이지</span>
        <span>로그아웃</span>
      </div>
    </header>
  );
}

export default Header;