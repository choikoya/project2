import React, { useState } from 'react';
import './signUpModal.css'; // 스타일 파일 추가

function SignupModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');

  const handleSignup = async(e) => {
    e.preventDefault();
    // 회원가입 처리 로직을 여기에 추가
    console.log('회원가입 정보:', { name, phoneNumber, vehicleNumber });

    try {
        const response = await fetch('http://192.168.0.133:8080/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phoneNumber, vehicleNumber }),
        });

        if(response.ok){
     alert('회원가입이 완료되었습니다.');
    onClose(); // 회원가입 완료 후 모달 닫기
  }else{
  alert('회원가입 실패');
}  
}catch (error) {
    console.error('회원가입 오류:', error);
    alert('회원가입 중 오류가 발생했습니다.');
  }
};


  if (!isOpen) 
    return null; // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>회원가입</h2>
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름(예시 : 홍길동)" // 이름 필드 플레이스홀더 추가
              required
            />
          </div>
          <div className="form-group">
            <label>전화번호</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="핸드폰 번호(예시 : 01012345678)" // 핸드폰 번호 필드 플레이스홀더 추가
              required
            />
          </div>
          <div className="form-group">
            <label>차량번호</label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="차량 번호(예시 : 부산00가0000)" // 차량 번호 필드 플레이스홀더 추가
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="submit" className="modal-button">회원가입</button>
            <button type="button" className="modal-button" onClick={onClose}>닫기</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupModal;
