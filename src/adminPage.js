import React, { useState, useEffect } from 'react';
import './css/adminPage.css'; // AdminPage에 대한 스타일 파일을 연결
import Pagenation from './pagenation'; // 분리된 Pagination 컴포넌트를 import

const AdminPage = () => {
  const [approvals, setApprovals] = useState([]); // 승인 대기 사용자 목록
  const [filteredApprovals, setFilteredApprovals] = useState([]); // 필터된 사용자 목록
  const [filterStatus, setFilterStatus] = useState('전체'); // 기본 필터 상태는 '전체'
  const [role, setRole] = useState(''); // 역할 상태 저장
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const approvalsPerPage = 10; // 한 페이지당 표시할 항목 수
  const [pageRange, setPageRange] = useState([1, 10]); // 페이지네이션 범위 (처음 1~10)
  const [changedApprovals, setChangedApprovals] = useState([]); // 변경된 승인 목록 저장

  // 페이지 로드 시 승인 목록과 역할을 백엔드에서 불러오는 함수
  const fetchApprovals = async () => {
    setLoading(true); // 로딩 시작
    try {
      const token = localStorage.getItem('authToken');
      const userRole = localStorage.getItem('userRole');
      setRole(userRole);

      const response = await fetch('http://192.168.0.142:8080/admin/members', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setApprovals(data);
        setFilteredApprovals(data); // 기본적으로 전체 목록을 필터된 목록으로 설정
      } else {
        console.error('데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
    } finally {
      setLoading(false); // 로딩 종료
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
      setFilteredApprovals(approvals.filter((approval) => approval.register === false || changedApprovals.includes(approval.username)));
    }
  }, [filterStatus, approvals, changedApprovals]);

  // 승인 버튼을 클릭했을 때 상태를 업데이트하는 함수
  const handleApproval = async (id) => {
    // UI에서 승인 상태를 미리 변경하여 "승인완료"로 보여줌
    setApprovals((prevApprovals) =>
      prevApprovals.map((approval) =>
        approval.username === id ? { ...approval, register: true } : approval
      )
    );

    setFilteredApprovals((prevFiltered) =>
      prevFiltered.map((approval) =>
        approval.username === id ? { ...approval, register: true } : approval
      )
    );

    // 승인된 항목을 변경된 목록에 추가하여 미승인 목록에서도 유지
    setChangedApprovals((prevChanged) => [...prevChanged, id]);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://192.168.0.142:8080/admin/members/register?username=${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`승인 요청 실패: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('승인 요청 중 오류 발생:', error);

      // 서버 요청 실패 시 UI 상태 복구
      setApprovals((prevApprovals) =>
        prevApprovals.map((approval) =>
          approval.username === id ? { ...approval, register: false } : approval
        )
      );

      setFilteredApprovals((prevFiltered) =>
        prevFiltered.map((approval) =>
          approval.username === id ? { ...approval, register: false } : approval
        )
      );

      // 승인된 목록에서 항목 제거
      setChangedApprovals((prevChanged) => prevChanged.filter((username) => username !== id));
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.length !== 11) {
      return phoneNumber; // 오류 처리: 잘못된 전화번호
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7)}`;
  };

  // 현재 페이지에 맞는 승인 목록을 계산
  const indexOfLastApproval = currentPage * approvalsPerPage;
  const indexOfFirstApproval = indexOfLastApproval - approvalsPerPage;
  const currentApprovals = filteredApprovals.slice(indexOfFirstApproval, indexOfLastApproval);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredApprovals.length / approvalsPerPage);

  return (
    <div className="admin-page">
      <h2>회원 정보 리스트</h2>

      {/* 로딩 중일 때 메시지 표시 */}
      {loading && <p>로딩 중...</p>}

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
            <th>핸드폰 번호</th>
            <th>확인</th>
          </tr>
        </thead>
        <tbody>
          {currentApprovals.map((approval) => (
            <tr key={approval.username}>
              <td>{approval.username}</td>
              <td>{formatPhoneNumber(approval.phonenumber) || '번호 없음'}</td>
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

      {/* 페이지네이션 컴포넌트 사용 */}
      <Pagenation
        currentPage={currentPage}
        totalPages={totalPages}
        pageRange={pageRange}
        setPageRange={setPageRange}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default AdminPage;
