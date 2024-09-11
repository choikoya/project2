import React from 'react';
import './footer.css';  // 푸터에 대한 별도 CSS

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-team">
          <h3>Team Members</h3>
          <ul>
            <li>DataAnalysis 박정현 - @gmail.com</li>
            <li>BackEnd 제갈태은 - xodms8666@naver.com</li>
            <li>FrontEnd 최고야 - choikoyaaa@gmail.com</li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Information</h3>
          <p>부산대학교 과학기술연구동</p>
          <p>1234 Science and Technology Building, Pusan National University</p>
          <p>전화번호: 051-123-4567</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>copyright © 2024. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
