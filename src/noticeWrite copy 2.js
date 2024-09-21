import React, { useState } from 'react';
import './noticeWrite.css'; // 스타일 파일 추가
import { useNavigate } from 'react-router-dom';

function NoticeWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file1, setFile1] = useState(null); // 백엔드에 보내는 파일
  // const [isNotice, setIsNotice] = useState(false);

  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFile1Change = (e) => {
    setFile1(e.target.files[0]);
  };

  // 공지사항 등록 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 파일을 포함한 데이터 폼 구성 (FormData 사용)
    const formData = new FormData();
    formData.append('title', title); // 백엔드에서 기대하는 필드 이름 'title'
    formData.append('content', content); // 백엔드에서 기대하는 필드 이름 'content'
    
       // 파일이 없는 경우에도 빈 파일 필드를 추가하여 일관성 있게 처리
    formData.append('file', file1 || new Blob()); // file1이 없으면 빈 Blob 객체를 추가); // 백엔드에서 기대하는 필드 이름 'file'

    try {
      const token = localStorage.getItem('authToken'); // 인증 토큰 가져오기

      // 백엔드로 POST 요청 전송
      const response = await fetch('http://192.168.0.133:8080/member/community', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // 인증 토큰을 포함
        },
        body: formData, // 폼 데이터를 전송
      });

      console.log(response);
      if (response.ok) {
        alert('공지사항이 등록되었습니다.');
        navigate('/notice'); // 등록 후 공지사항 목록으로 이동
      } else {
        alert('공지사항 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('오류 발생:', error);
      alert('서버와 통신하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="notice-write-page">
      <h2>공지사항 작성</h2>
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
        {/* <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={isNotice}
              onChange={(e) => setIsNotice(e.target.checked)}
            />
            공지
          </label>
        </div> */}
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
          <button type="submit">등록</button>
        </div>
      </form>
    </div>
  );
}

export default NoticeWrite;
