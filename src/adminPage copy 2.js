import React, { useState, useEffect } from 'react';
import './adminPage.css'; // AdminPage에 대한 스타일 파일을 연결

const AdminPage = () => {
  const [approvals, setApprovals] = useState([]); // 승인 대기 사용자 목록
  const [filteredApprovals, setFilteredApprovals] = useState([]); // 필터된 사용자 목록
  const [filterStatus, setFilterStatus] = useState('전체'); // 기본 필터 상태는 '전체'
  const [role, setRole] = useState(''); // 역할 상태 저장

  // 페이지 로드 시 승인 목록과 역할을 백엔드에서 불러오는 함수
  const fetchApprovals = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      setRole(userRole);

      console.log("토큰", token);

      const response = await fetch('http://192.168.0.133:8080/admin/members', {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`, // 토큰을 헤더에 포함
          "Content-Type": "application/json",
        },
      });
      console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log("데이터", data);
        setApprovals(data); // 전체 목록을 상태에 저장
        setFilteredApprovals(data); // 기본적으로 전체 목록을 필터된 목록으로 설정
      } else {
        console.error('데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
    }
  };

  // 페이지 로드 시 데이터를 불러옴
  useEffect(() => {
    fetchApprovals();
  }, []);

  // 필터 상태에 따라 목록을 필터링
  useEffect(() => {
    if (filterStatus === '전체') {
      setFilteredApprovals(approvals);
    } else if (filterStatus === '승인완료') {
      setFilteredApprovals(approvals.filter((approval) => approval.register === true));
    } else if (filterStatus === '미승인') {
      setFilteredApprovals(approvals.filter((approval) => approval.register === false));
    }
  }, [filterStatus, approvals]);

  // 승인 버튼을 클릭했을 때 상태를 업데이트하는 함수 (백엔드로 승인 요청 보내기)
  const handleApproval = async (id) => {
    try {
      const response = await fetch(`http://192.168.0.133/api/approvals/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: '승인완료' }), // 승인 완료 상태를 전송
      });

      if (response.ok) {
        // 승인 완료 후 상태를 업데이트 (현재는 프론트에서만 처리)
        setApprovals((prevApprovals) =>
          prevApprovals.map((approval) =>
            approval.username === id ? { ...approval, register: true } : approval
          )
        );
      } else {
        console.error('승인 요청 실패');
      }
    } catch (error) {
      console.error('승인 요청 중 오류 발생:', error);
    }
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

      {/* 사용자 리스트 출력 */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>차량번호</th>
            <th>핸드폰 번호</th> {/* 핸드폰 번호는 API에서 제공되지 않으면 임시 필드 사용 */}
            <th>확인</th>
          </tr>
        </thead>
        <tbody>
          {filteredApprovals.map((approval) => (
            <tr key={approval.username}>
              <td>{approval.username}</td> {/* 차량번호에 username 사용 */}
              <td>{approval.phoneNumber || "번호 없음"}</td> {/* 핸드폰 번호가 없으면 "번호 없음" */}
              <td>
                <button
                  className={`approve-btn ${approval.register ? 'approved' : 'pending'}`}
                  onClick={() => handleApproval(approval.username)}
                  disabled={approval.register}
                >
                  {approval.register ? '승인완료' : '승인대기'}
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
