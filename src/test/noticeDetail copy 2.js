//되는코드.
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // React Router 사용
import './noticeDetail.css'; // 스타일 파일 추가

function NoticeDetail() {
  const { id} = useParams(); // URL에서 공지사항 ID를 가져옴
  console.log("나와라",id);
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null); // 공지사항 데이터를 관리하는 상태
  const [isAdmin, setIsAdmin] = useState(false); // 관리자인지 여부를 확인하는 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editedTitle, setEditedTitle] = useState(''); // 수정된 제목
  const [editedContent, setEditedContent] = useState(''); // 수정된 내용

  // 페이지 로드 시 사용자 역할 및 공지사항 데이터 가져오기
  useEffect(() => {
    console.log("공지사항 ID:", id); // ID 값 확인
    const userRole = localStorage.getItem('userRole'); // 로컬 스토리지에서 사용자 역할 확인
    if (userRole === 'ROLE_ADMIN') {
      setIsAdmin(true); // 관리자인 경우
    }

    const fetchNoticeDetail = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://192.168.0.133:8080/member/community/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNotice(data); // 공지사항 데이터를 상태에 저장
          setEditedTitle(data.title); // 수정 모드에 초기값 설정
          setEditedContent(data.content); // 수정 모드에 초기값 설정
          console.log(data);
        } else {
          alert('해당 공지사항을 찾을 수 없습니다.');
          navigate('/notice'); // 공지사항을 찾을 수 없으면 공지사항 페이지로 이동
        }
      } catch (error) {
        console.error('오류 발생:', error);
        navigate('/notice'); // 오류 발생 시 공지사항 목록으로 이동
      }
    };

    fetchNoticeDetail();
  }, [id, navigate]);

  // 수정 버튼 클릭 처리
  const handleEdit = () => {
    setIsEditing(true); // 수정 모드로 전환
  };

  // 수정 저장 처리
  const handleSaveEdit = () => {
    const updatedNotice = { ...notice, title: editedTitle, content: editedContent };
    setNotice(updatedNotice);
    setIsEditing(false); // 수정 모드 종료
  };

  // 삭제 버튼 클릭 처리
  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      // 삭제 로직 구현
      alert('삭제되었습니다.');
      navigate('/notice'); // 삭제 후 공지사항 목록으로 이동
    }
  };

  return (
    <div className="notice-detail-page">
      {notice ? (
        <>
          {isEditing ? (
            <div>
              <h2>공지사항 수정</h2>
              <div className="form-group">
                <label>제목</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>내용</label>
                <textarea
                  rows="5"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </div>
              <div className="admin-buttons">
                <button className="edit-button" onClick={handleSaveEdit}>
                  저장
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setIsEditing(false)}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2>{notice.title}</h2>
              <p>작성자: {notice.member.username}</p>
              <p>작성일: {new Date(notice.createDate).toLocaleDateString()}</p>
              <p>조회수: {notice.count}</p>
              <div className="notice-content">{notice.content}</div>

              {/* 관리자인 경우 수정/삭제 버튼 표시 */}
              {isAdmin && (
                <div className="admin-buttons">
                  <button className="edit-button" onClick={handleEdit}>수정</button>
                  <button className="delete-button" onClick={handleDelete}>삭제</button>
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <p>공지사항을 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default NoticeDetail;
