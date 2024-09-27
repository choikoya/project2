import Slider from "react-slick";
import './css/login.css';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
import Modal from 'react-modal';  // 새쪽지 팝업을 위한 모달 추가

Modal.setAppElement('#root'); // 모달을 사용할 경우 root 엘리먼트 지정

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // 회원가입 모달 상태 관리
  const [hasNewMessages, setHasNewMessages] = useState(false);  // 새쪽지 여부 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false); // 새쪽지 팝업 상태 관리
  const navigate = useNavigate();

  // 페이지 로드 시 로그인 상태 확인
  useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      // 로그인 상태일 때 페이지 이동
      setIsLoggedIn(true);
      const role = sessionStorage.getItem('userRole');
      if (role === 'ROLE_ADMIN') {
        navigate('/notice');
      } else {
        navigate('/notice');
      }
    }
  }, [navigate]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    arrows: true,
  };

  // 로그인 폼 제출 시 처리하는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log("보낸 데이터:", { username, password });

    if (!username || !password) {
      setError('아이디와 비밀번호를 입력하세요.');
      return;
    }

    try {
      // 백엔드 API로 로그인 요청 보내기
      const response = await fetch('http://192.168.0.142:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // 입력받은 id, password 전송
      });

      if (response.ok) {
        const data = await response.json(); // JSON 응답을 처리합니다.
        const token = data.token;
        const role = data.role; // 서버에서 역할을 응답으로 받는다고 가정합니다.

        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('userRole', role); // 역할 저장
          
          console.log('Received role:', role);
          console.log('Received token:', token);

          // SessionStorage에도 저장
  sessionStorage.setItem('authToken', token);
  sessionStorage.setItem('userRole', role);


           // 값이 저장되었는지 확인하는 로그
  console.log('Session storage set: ', sessionStorage.getItem('userRole'));

          // 로그인 성공 알림 표시
          alert('로그인 성공!');

          // 새쪽지 확인 로직 추가
          await checkForNewMessages(token);

          // 사용자 역할에 따라 페이지 이동
          if (role === 'ROLE_ADMIN') {
            navigate('/notice'); // 관리자 페이지
          } else {
            navigate('/notice'); // 일반 사용자 페이지
          }
        } else {
          throw new Error('Token not found in response.');
        }
      } else {
        alert('로그인 실패: 관리자의 승인 대기중입니다.');
      }

    } catch (error) {
      console.error('로그인 오류:', error);
      setError('알 수 없는 오류가 발생했습니다.');
    }
  };

  // 서버에 새쪽지 있는지 확인하는 함수
  const checkForNewMessages = async (token) => {
    try {
      const response = await fetch('http://192.168.0.142:8080/api/messages/new', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.hasNewMessages) {
          setHasNewMessages(true);
          setIsModalOpen(true); // 새쪽지가 있으면 팝업 열기
        }
      } else {
        console.error('새쪽지 확인 실패');
      }
    } catch (error) {
      console.error('새쪽지 확인 오류:', error);
    }
  };

  // 새쪽지 팝업 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="login-page">
      <Slider {...settings} className="background-slider">
        <div>
          <img src="/images/image1.jpg" alt="Slide 1" className="slider-image" />
        </div>
        <div>
          <img src="/images/image2.jpg" alt="Slide 2" className="slider-image" />
        </div>
        <div>
          <img src="/images/image3.jpg" alt="Slide 3" className="slider-image" />
        </div>
      </Slider>
      <div className="overlay"></div>
      <div className="login-container">
        <h1>작업차량 통합관리 시스템</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="text"
            placeholder="차량 번호(예시 : 부산00가0000)"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input type="password"
            placeholder="핸드폰 번호(예시 : 01012345678)"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-button">로그인</button>
          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="account-options">
          <button className="signup-button" onClick={() => setIsSignupModalOpen(true)}>회원가입</button>
          <button className="delete-account-button" onClick={() => navigate('/delete-account')}>회원탈퇴</button>
        </div>

        {/* 새쪽지 팝업 모달 */}
        <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
          <h2>새로운 쪽지가 있습니다!</h2>
          <p>쪽지함을 확인해보세요.</p>
          <button onClick={closeModal}>닫기</button>
        </Modal>
      </div>
    </div>
  );
}

// 커스텀 화살표 컴포넌트
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", right: "10px", zIndex: 5, color: "#fff" }}
      onClick={onClick}
    >
      ❯
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", left: "10px", zIndex: 5, color: "#fff" }}
      onClick={onClick}
    >
      ❮
    </div>
  );
}

export default LoginPage;
