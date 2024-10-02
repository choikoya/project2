import React, { useState } from 'react';
import './signUpModal.css';  // 모달 스타일을 위한 CSS 파일

function SignupModal({ onClose, onSignup }) {
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (signupUsername && signupPassword) {
      onSignup(signupUsername, signupPassword);
    } else {
      alert('아이디와 비밀번호를 입력하세요.');
    }
  };

  return (
    <div className="modal-overlay"> {/* 오버레이를 위한 클래스 적용 */}
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>회원가입</h2>
        <form onSubmit={handleSignupSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="아이디(차량번호)"
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="비밀번호(핸드폰번호)"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="input-field"
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
