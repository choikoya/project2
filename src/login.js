
import Slider from "react-slick";
import './login.css';
import { useNavigate } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false); // 회원가입 모달 상태 관리
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
    dots: true, // 하단에 슬라이드 이동 점 표시
    infinite: true, // 무한 슬라이드
    speed: 500, // 슬라이드 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 개수
    autoplay: true, // 자동 재생
    autoplaySpeed: 7000, // 자동 재생 속도 (7초에 한 번씩 슬라이드)
    arrows: true, // 기본 화살표 비활성화
    // nextArrow: <SampleNextArrow />, // 커스텀 화살표
    // prevArrow: <SamplePrevArrow /> // 커스텀 화살표
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

        // 로그인 성공 알림 표시
        alert('로그인 성공!');

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

  const handleSignup = async () => {
    // 회원가입을 위한 API 호출
    try {
      const response = await fetch('http://192.168.0.142:8080/login/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // 필요에 따라 회원가입에 맞는 데이터 구조로 변경
      });

      if (response.ok) {
        alert('회원가입 성공!관리자의 승인 대기중입니다.');
        navigate('/'); // 회원가입 후 로그인 페이지로 이동
      } else {
        alert( '회원가입 실패: 정보를 확인하세요.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('알 수 없는 오류가 발생했습니다.');
    }
  };



  return (
    <div className="login-page">
      {/* 슬라이더가 먼저 렌더링되며, 로그인 폼은 z-index로 슬라이더 위에 표시 */}
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
      {/* 로그인 폼 - 슬라이더와 오버레이 위에 표시되도록 z-index 설정 */}
      <div className="login-container">
        <h1>작업차량 통합관리 시스템</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <input type="text"
            placeholder="차량 번호(예시 : 부산00가0000)"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // 입력 값 변경 처리
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
          <button className="signup-button" onClick={handleSignup}>회원가입</button>
          <button className="delete-account-button" onClick={() => navigate('/delete-account')}>회원탈퇴</button>
        </div>
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
      onClick={onClick} // 클릭 이벤트 연결
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
      onClick={onClick} // 클릭 이벤트 연결
    >
      ❮
    </div>
  );
}

export default LoginPage;