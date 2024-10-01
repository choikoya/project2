import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css'; // 헤더에 대한 별도 CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons'; // 'Envelope' 아이콘 import
import { faTimes, faChevronLeft, faBullhorn, faTachometerAlt, faChartBar, faCar } from '@fortawesome/free-solid-svg-icons'; // 필요한 아이콘 import
import Modal from 'react-modal'; // react-modal 라이브러리 import
import MessageBox from '../timetable/messageBox'; // 쪽지함 컴포넌트 import

Modal.setAppElement('#root'); // 모달 접근성 설정

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false); // 사이드바 확장 상태 추가
  const navigate = useNavigate();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole('');
    navigate('/');
    setIsMessageModalOpen(false);
  };

  const openMessageModal = () => {
    setIsMessageModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
  };

  // 사이드바 확장 및 축소 핸들러
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <aside className={`sidebar ${isSidebarExpanded ? 'expanded' : ''}`}>
      {/* 상단에 왼쪽을 향한 화살표 표시 */}
      <div className="sidebar-toggle-icon" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faChevronLeft} /> {/* 왼쪽 화살표로 변경 */}
      </div>

      <div className="sidebar-header">
        <h1>관리자 시스템</h1>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li>
            <Link to="/notice">
              <FontAwesomeIcon icon={faBullhorn} style={{ marginRight: '10px' }} /> {/* 공지사항 아이콘 추가 */}
              공지사항
            </Link>
          </li>
          <li>
            <Link to="/dashboard">
              <FontAwesomeIcon icon={faTachometerAlt} style={{ marginRight: '10px' }} /> {/* 대시보드 아이콘 추가 */}
              대시보드
            </Link>
          </li>
          <li>
            <Link to="/result">
              <FontAwesomeIcon icon={faChartBar} style={{ marginRight: '10px' }} /> {/* 모니터링 아이콘 추가 */}
              모니터링
            </Link>
          </li>
          <li>
            <Link to="/timetable">
              <FontAwesomeIcon icon={faCar} style={{ marginRight: '10px' }} /> {/* 입출차 조회 아이콘 추가 */}
              입출차 조회
            </Link>
          </li>
        </ul>
      </nav>

      <div className="admin-section">
        {userRole === 'ROLE_ADMIN' && (
          <span><Link to="/adminPage">관리자 페이지</Link></span>
        )}

        {userRole === 'ROLE_MEMBER' && (
          <button className="message-icon" onClick={openMessageModal}>
            <FontAwesomeIcon icon={faEnvelope} />
            <span className="new-message-badge">3</span> {/* 새쪽지 예시 */}
          </button>
        )}

        {isLoggedIn ? (
          <span className="logout-button" onClick={handleLogout}>로그아웃</span>
        ) : (
          <span><Link to="/">로그인</Link></span>
        )}
      </div>

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
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <MessageBox />
      </Modal>
    </aside>
  );
}

export default Header;
