import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // React Router 사용
import './noticeDetail.css'; // 스타일 파일 추가

function NoticeDetail() {
  const { id } = useParams(); // URL에서 공지사항 ID를 가져옴
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null); // 공지사항 데이터를 관리하는 상태
  const [isAdmin, setIsAdmin] = useState(false); // 관리자인지 여부를 확인하는 상태
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editedTitle, setEditedTitle] = useState(''); // 수정된 제목
  const [editedContent, setEditedContent] = useState(''); // 수정된 내용

  // 공지사항 더미 데이터 (여기서는 간단히 더미 데이터로 처리)
  const [notices, setNotices] = useState([
    { id: 4, title: '공지사항입니다', writer: '관리자', date: '2024-09-03 12:52', views: 50, content: '공지사항 내용입니다.' },
    { id: 3, title: '공지사항입니다', writer: '관리자', date: '2024-09-03 12:52', views: 50, content: '공지사항 내용입니다.' },
    { id: 2, title: '공지사항입니다', writer: '관리자', date: '2024-09-03 12:52', views: 50, content: '공지사항 내용입니다.' },
    { id: 1, title: '공지사항입니다', writer: '관리자', date: '2024-09-03 12:52', views: 50, content: '공지사항 내용입니다.' },
  ]);

  // 페이지 로드 시 사용자 역할 및 공지사항 데이터 가져오기
  useEffect(() => {
    const userRole = sessionStorage.getItem('userRole'); // 세션에서 사용자 역할 확인
    
    if (userRole === 'ROLE_ADMIN') {
      setIsAdmin(true); // 관리자인 경우
    }

    // 해당 공지사항 ID로 데이터를 찾음
    const selectedNotice = notices.find((n) => n.id === parseInt(id));
    if (selectedNotice) {
      setNotice(selectedNotice);
      setEditedTitle(selectedNotice.title); // 수정 모드에 초기값 설정
      setEditedContent(selectedNotice.content); // 수정 모드에 초기값 설정
    } else {
      alert('해당 공지사항을 찾을 수 없습니다.');
      navigate('/notice'); // 공지사항을 찾을 수 없으면 공지사항 페이지로 이동
    }
  }, [id, navigate, navigate]);

  // 수정 버튼 클릭 처리
  const handleEdit = () => {
   setIsEditing(true);//수정모드로 전환
    // 수정 페이지로 이동하거나 수정 폼을 띄우는 로직을 추가할 수 있음
  };


  // 수정 저장 처리
  const handleSaveEdit = () => {
    const updatedNotices = notices.map((n) => 
      n.id === notice.id ? { ...n, title: editedTitle, content: editedContent } : n
    );
    setNotices(updatedNotices);
    setIsEditing(false); // 수정 모드 종료
  };


  // 삭제 버튼 클릭 처리
  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      // 삭제 로직 구현
      const updatedNotices = notices.filter((n) => n.id !== notice.id);
      setNotices(updatedNotices);
      alert('삭제되었습니다.');
      navigate('/notice'); // 삭제 후 메인 페이지로 이동
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
          <p>작성자: {notice.writer}</p>
          <p>작성일: {notice.date}</p>
          <p>조회수: {notice.views}</p>
          <div className="notice-content">
            {notice.content}
          </div>

          {/* 관리자인 경우 수정/삭제 버튼 표시 */}
          {/* {isAdmin && ( */}
            <div className="admin-buttons">
              <button className="edit-button" onClick={handleEdit}>수정</button>
              <button className="delete-button" onClick={handleDelete}>삭제</button>
            </div>
          {/* )} */}
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
