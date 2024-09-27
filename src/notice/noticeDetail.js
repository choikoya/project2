import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // React Router 사용
import '../css/noticeDetail.css'; // 스타일 파일 추가

function NoticeDetail() {
  const { id } = useParams(); // URL에서 공지사항 ID를 가져옴
  console.log("나와라", id);
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null); // 공지사항 데이터를 관리하는 상태
  const [reply, setReply] =useState([]);  //댓글
  const fileNames = notice && notice.fileName ? notice.fileName.split(',') : [];


  const token = localStorage.getItem('authToken');
  // 페이지 로드 시 사용자 역할 및 공지사항 데이터 가져오기
  useEffect(() => {
    console.log("공지사항 ID:", id); // ID 값 확인

    const fetchData = async () => {
      await fetchNoticeDetail();
      await fetchNoticeDetailReply ();
    };

    fetchData();
}, [id, navigate]);

  const fetchNoticeDetail = async () => {
  try {
      console.log("Fetching notice detail...");
      const response = await fetch(`http://192.168.0.142:8080/member/community/${id}`, {
          method: 'GET',
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });

      if (response.ok) {
          const data = await response.json();
          console.log("Notice data:", data); // Check if data is received
          setNotice(data);
      } else {
          console.error('Failed to fetch notice:', response.status);
          alert('해당 공지사항을 찾을 수 없습니다.(작성자만 열람가능)');
          navigate('/notice');
      }
  } catch (error) {
      console.error('Error fetching notice detail:', error);
      navigate('/notice');
  }
};

const fetchNoticeDetailReply = async () => {
  try {
    const response = await fetch(`http://192.168.0.142:8080/member/reply/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Corrected template literal syntax
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      setReply(data); // Save replies to state
      console.log(data); // Log the received data
    } else {
      alert('해당 공지사항의 댓글을 찾을 수 없습니다.');
      navigate('/notice'); // Navigate if replies are not found
    }
  } catch (error) {
    console.error('오류 발생:', error);
    navigate('/notice'); // Navigate on error
  }
};


  // 수정 버튼 클릭 처리
  const handleEdit = () => {
    navigate(`/reWrite/${id}`); 
  };

  

  // 삭제 버튼 클릭 처리
  const handleDelete =  async () =>{
   

  
    if (window.confirm('정말 삭제하시겠습니까?')) {

      try {
      // 삭제 로직 구현
     
      const response = await fetch(`http://localhost:8080/member/community/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        alert('삭제되었습니다.');
        navigate('/notice'); // 공지사항을 찾을 수 없으면 공지사항 페이지로 이동
      } 
      else if (response.status==403){
        alert('작성자만 삭제 권한 가집니다.');
        navigate('/notice');
      }
    }
      
     catch (error) {
      console.error('오류 발생:', error);
      navigate('/notice'); // 오류 발생 시 공지사항 목록으로 이동
    }
     
    
 
  };
}
const handleReply=   () =>{
  navigate(`/replywrite/${id}`)

}
  return (
    <div className="notice-detail-page">
      {notice ? (
        <>
          <div className="notice-header">
            <div className="title">TITLE: {notice.title}</div>
            <div className="date">DATE: {new Date(notice.createDate).toLocaleString()}</div>
          </div>

          <div className="notice-content">
            {notice.content}
           
          </div>
          <div>
    {fileNames.length > 0 ? (
      fileNames.map((fileName, index) => (
        <a
          key={index} // Use index as key; consider a better unique identifier if available
          href={`http://localhost:8080/image/${fileName.trim()}`} // Use trimmed file names
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: '#007bff', display: 'block' }} // Change display to block for better readability
          onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
        >
          {fileName.trim()} {/* Trim to remove any extra spaces */}
        </a>
      ))
    ) : (
      <span>No files available</span> // Optional: Message if no files are present
    )}
  </div>

          {/* 관리자 버튼 영역 */}
          <div className="notice-footer">
            <div className="button-group">
              
                <>
                  <button className="edit-button" onClick={handleEdit}>수정</button>
                  <button className="delete-button" onClick={handleDelete}>삭제</button>
                  <button className="edit-button" onClick={handleReply}>댓글</button>
                </>
              
            </div>
            <button className="list-button" onClick={() => navigate('/notice')}>목록</button>
            
          </div>

          {/* 하단 목록 예시 */}
          <table className="notice-list">
            <thead>
              <tr>
                <th>번호</th>
                <th>내용</th>
                <th>작성자</th>
                <th>작성일</th>
                
              </tr>
            </thead>
            <tbody>
            {reply.map((comment, index) => (
            <tr key={comment.boardReId}>
              <td>{index + 1}</td> {/* Auto incrementing number */}
              <td>{comment.content}</td>
              <td>{comment.member.username}</td>
              <td>{new Date(comment.createDate).toLocaleString()}</td> {/* Format date */}
            </tr>
          ))}
            </tbody>
           
          </table>
        </>
      ) : (
        <p>공지사항을 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default NoticeDetail;