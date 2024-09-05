
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
  const navigate = useNavigate();

   // 페이지 로드 시 로그인 상태 확인
   useEffect(() => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true);
      // navigate('/upload');  // 이미 로그인된 사용자는 다른 페이지로 리다이렉트
    }
  }, []);

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
        // 'Authorization' 헤더에서 토큰을 추출합니다.
        const token = response.headers.get('Authorization');
        //const role = data.role;   // 백엔드에서 받은 역할 ("admin" 또는 "user")
        if (token) {
          // 'Bearer ' 접두사를 제거합니다.
          const jwtToken = token.replace('Bearer ', '');
          
          // JWT 토큰을 sessionStorage에 저장
        sessionStorage.setItem('authToken', jwtToken);
        //sessionStorage.setItem('userRole', role);

        console.log('Received token:', jwtToken);

        // 로그인 성공 알림 표시
        alert('로그인 성공!');

        // 관리자와 일반 사용자 구분
        if (username === 'admin') {
          navigate('/upload');  // 관리자일 경우 /adminpage로 이동
        } else {
          navigate('/');  // 일반 사용자일 경우 /upload로 이동
        }
    } else {
      throw new Error('Authorization header not found.');
    }
  } else {
    const errorData = await response.text();
    setError(errorData || '로그인 실패: 아이디나 비밀번호를 확인하세요.');
  }

        // if (role === 'admin') {
        //   navigate('/upload');
        // } else {
        //   // 로그인 후 대시보드로 이동
        //   navigate('/upload');
        // }
      
        // // 응답 상태 코드와 오류 메시지 출력
        // console.error('로그인 실패, 상태 코드:', response.status);
        // alert('로그인 실패: 아이디나 비밀번호를 확인하세요.');
      
    } catch (error) {
      console.error('로그인 오류:', error);
      setError('알 수 없는 오류가 발생했습니다.');
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
            placeholder="차량번호"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // 입력 값 변경 처리
          />
          <input type="password"
            placeholder="핸드폰번호"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
          <button type="submit" className="login-button">로그인</button>
          {error && <div className="error-message">{error}</div>}
        </form>

        <div className="account-options">
          <button className="signup-button" onClick={() => navigate('/signup')}>회원가입</button>
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