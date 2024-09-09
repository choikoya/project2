import React, { useState } from 'react';
import './adminPage.css'; // AdminPage에 대한 스타일 파일을 연결

const AdminPage = () => {
  // 초기 상태: 승인 대기 중인 목록
  const [approvals, setApprovals] = useState([]);// 백엔드에서 받아올 승인 대기 사용자 목록


  // 필터 상태를 관리하는 상태 변수 (전체, 미승인, 승인된 사용자)
  const [filterStatus, setFilterStatus] = useState('전체'); // 기본 필터 상태는 '미승인'

  // 승인 버튼을 클릭했을 때 상태 변경 함수
  const handleApproval = (id) => {
    setApprovals((prevApprovals) =>
      prevApprovals.map((approval) =>
        approval.id === id && approval.status === '대기'
          ? { ...approval, status: '완료' }
          : approval
      )
    );
  };

  // 필터링된 승인 리스트를 반환하는 함수
  const getFilteredApprovals = () => {
    if (filterStatus === '미승인') {
      return approvals.filter((approval) => approval.status === '대기');
    } else if (filterStatus === '승인완료') {
      return approvals.filter((approval) => approval.status === '완료');
    }
    return approvals; // 기본은 전체
  };

  return (
    <div className="admin-page">
      <h2>회원 정보 리스트</h2>
      
      {/* 필터링 버튼 */}
      <div className="filter-buttons">
  <button className={`filter-btn all-btn ${filterStatus === '전체' ? 'active' : ''}`} onClick={() => setFilterStatus('전체')}>전체</button>
  <button className={`filter-btn pending-btn ${filterStatus === '미승인' ? 'active' : ''}`} onClick={() => setFilterStatus('미승인')}>미승인</button>
  <button className={`filter-btn approved-btn ${filterStatus === '승인완료' ? 'active' : ''}`} onClick={() => setFilterStatus('승인완료')}>승인완료</button>
</div>


      <table>
        <thead>
          <tr>
            <th>차량번호</th>
            <th>핸드폰 번호</th>
            <th>확인</th>
          </tr>
        </thead>
        <tbody>
          {getFilteredApprovals().map((approval) => (
            <tr key={approval.id}>
              <td>
                {approval.carNumber}{' '}
                {approval.status === '대기' ? (
                  <span className="new-badge">N</span>
                ) : null}
              </td>
              <td>{approval.phoneNumber}</td>
              <td>
                <button
                  className={`approve-btn ${
                    approval.status === '대기' ? 'pending' : 'approved'
                  }`}
                  onClick={() => handleApproval(approval.id)}
                  disabled={approval.status !== '대기'}
                >
                  {approval.status === '대기' ? '승인대기' : '승인완료'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
