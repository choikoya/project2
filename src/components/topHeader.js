import React from 'react';
import './topHeader.css'; // 탑헤더에 대한 스타일

function TopHeader() {
  return (
    <header className="top-header">
      <div className="logo-container">
        <h1 className="company-name">MetalCycle</h1>
      </div>
    </header>
  );
}

export default TopHeader;