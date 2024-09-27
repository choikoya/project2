import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link 컴포넌트 추가
import './header.css';  // 헤더에 대한 별도 CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';  // Regular 스타일의 'Envelope' 아이콘 import
import { faTimes } from '@fortawesome/free-solid-svg-icons';  // Solid 스타일의 'Times' 아이콘 import
import Modal from 'react-modal'; // react-modal 라이브러리 import
import Message from '../timetable/messageBox'; // 쪽지함 컴포넌트 import

Modal.setAppElement('#root'); // 모달 접근성 설정

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(''); // 사용자 역할 상태 관리
  const navigate = useNavigate();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false); // 모달 상태 관리

  // 페이지 로드 시 로그인 상태 및 역할 확인
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole'); // 사용자 역할 확인
    if (token) {
      setIsLoggedIn(true); // 로그인 상태 설정
      setUserRole(role); // 역할 설정
    }
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // sessionStorage와 localStorage에서 authToken 및 userRole 삭제
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');

    setIsLoggedIn(false); // 로그아웃 상태로 전환
    setUserRole(''); // 역할 초기화
    navigate('/'); // 로그아웃 후 홈으로 이동
    setIsMessageModalOpen(false); // 모달 닫기
  };

  // 쪽지함 모달 열기/닫기 함수
  const openMessageModal = () => {
    setIsMessageModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
  };

  return (
    <header className="header">
      <nav>
        <ul className="nav-list">
          <li><Link to="/notice">공지사항</Link></li>
          <li><Link to="/dashboard">대시보드</Link></li>
          <li><Link to="/result">모니터링</Link></li>
          <li><Link to="/timetable" onClick={() => window.handleReloadForIncrementalLoad()}>입출차 조회</Link></li>
        </ul>
      </nav>
      
      {/* 사용자 역할에 따른 조건부 렌더링 */}
      <div className="admin-section">
        {userRole === 'ROLE_ADMIN' ? (
          <span><Link to="/adminPage">관리자 페이지</Link></span>
        ) : (
          <span>
            {/* 사용자 쪽지함 아이콘 추가 */}
            <button className="message-icon" onClick={openMessageModal}>
              {/* FontAwesome 'Envelope' 아이콘 */}
              <FontAwesomeIcon icon={faEnvelope} />
              {/* 새쪽지가 있을 경우 배지를 표시할 수도 있음 */}
              <span className="new-message-badge">3</span> {/* 예시로 3개의 새쪽지 */}
            </button>
          </span>
        )}

        {/* 로그인 상태에 따라 로그인/로그아웃 텍스트 변경 및 동작 처리 */}
        {isLoggedIn ? (
          <span className="nav-link logout-button" onClick={handleLogout}>로그아웃</span>
        ) : (
          <span><Link to="/">로그인</Link></span>
        )}

        {/* 쪽지 모달 */}
        <Modal
          isOpen={isMessageModalOpen}
          onRequestClose={closeMessageModal}
          contentLabel="쪽지함"
          className="modal"
          overlayClassName="modal-overlay"
        >
          <div className="modal-header">
            <h2>쪽지함</h2>
            <button className="custom-close-button" onClick={closeMessageModal}>
              <FontAwesomeIcon icon={faTimes} /> {/* 'X' 아이콘 */}
            </button>
          </div>
          <Message /> {/* Messages 컴포넌트를 모달 안에 렌더링 */}
        </Modal>
      </div>
    </header>
  );
}

export default Header;
