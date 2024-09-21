import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function NoticeReWrite() {
  const { id } = useParams(); // Get notice ID from URL
  const [content, setContent] = useState('');
  
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  
  


  // Handle content input change
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  
  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('content', content);

    try {
      const token = localStorage.getItem('authToken'); // Get auth token

      // Send PUT request to update the notice
      const response = await fetch(`http://192.168.0.142:8080/member/reply/write/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Include auth token
        },
        body: formData,
      });

      if (response.ok) {
        alert('댓글 등록되었습니다.');
        navigate(`/notice/${id}`); // Navigate to the updated notice
      } else {
        alert(`댓글 등록 실패했습니다`);
      }
    } catch (error) {
      console.error('오류 발생:', error);
      alert('서버와 통신하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="notice-write-page">
      <h2>게시물 댓글 작성</h2>
      <form onSubmit={handleSubmit}>
       
        <div className="form-group">
          <label>내용</label>
          <textarea
            value={content}
            onChange={handleContentChange}
            rows="10"
            placeholder="내용을 입력하세요."
          />
        </div>
        

        <div className="form-buttons">
          <button type="button" onClick={() => navigate(`/notice/${id}`)}>게시글 돌아가기</button>
          <button type="submit" disabled={loading}>{loading ? '저장 중...' : '등록'}</button>
        </div>
      </form>
    </div>
  );
}

export default NoticeReWrite;