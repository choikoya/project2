//입출차 목록 컴포넌트

import React from 'react';
// import './entryList.css'; // 필요 시 CSS 파일

function EntryList({ entryList }) {
  return (
    <div className="entry-list">
      <h2>입출차 현황</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>차량번호</th>
            <th>입차시간</th>
            <th>출차시간</th>
            <th>핸드폰 번호</th>
          </tr>
        </thead>
        <tbody>
          {entryList.map((entry, index) => (
            <tr key={index}>
              <td>{entry.carNumber}</td>
              <td>{entry.entryTime}</td>
              <td>{entry.exitTime}</td>
              <td>{entry.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EntryList;
