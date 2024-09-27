import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function NoticeReWrite() {
  const { id } = useParams(); // Get notice ID from URL
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file1, setFile1] = useState(null); // File to be sent to backend
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();
  
  // Fetch existing notice details on component mount
  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get auth token
        const response = await fetch(`http://192.168.0.142:8080/member/community/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include auth token
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTitle(data.title); // Set title from fetched data
          setContent(data.content); // Set content from fetched data
          setFile1(data.fileName);
        } else {
          alert('해당 공지사항을 찾을 수 없습니다.');
          navigate('/notice'); // Navigate if not found
        }
      } catch (error) {
        console.error('오류 발생:', error);
        alert('서버와 통신하는 중 오류가 발생했습니다.');
        navigate('/notice'); // Navigate on error
      }
    };

    fetchNoticeDetail(); // Call the fetch function
  }, [id, navigate]);

  // Handle title input change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handle content input change
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Handle file input change
  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('file', file1 || new Blob()); // Include file or empty Blob

    try {
      const token = localStorage.getItem('authToken'); // Get auth token

      // Send PUT request to update the notice
      const response = await fetch(`http://192.168.0.142:8080/member/community/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // Include auth token
        },
        body: formData,
      });

      if (response.ok) {
        alert('공지사항이 수정되었습니다.');
        navigate(`/notice/${id}`); // Navigate to the updated notice
      } else {
        alert(`공지사항 수정에 실패했습니다`);
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
      <h2>공지사항 수정</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목(*)</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>내용</label>
          <textarea
            value={content}
            onChange={handleContentChange}
            rows="10"
            placeholder="내용을 입력하세요."
          />
        </div>
        <div className="form-group">
          <input type="file" id="file" onChange={handleFile1Change} />
        </div>

        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/notice')}>목록</button>
          <button type="submit" disabled={loading}>{loading ? '저장 중...' : '등록'}</button>
        </div>
      </form>
    </div>
  );
}

export default NoticeReWrite;