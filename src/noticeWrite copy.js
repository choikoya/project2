//등록기능 추가 전

import React, { useState } from 'react';
import './noticeWrite.css'; // 스타일 파일 추가
import { useNavigate } from 'react-router-dom';

function NoticeWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [isSecret, setIsSecret] = useState(false);
  const [isNotice, setIsNotice] = useState(false);

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

  const handleFile2Change = (e) => {
    setFile2(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 등록 로직을 추가할 수 있습니다.
    alert('등록되었습니다.');
    navigate('/'); // 등록 후 메인 페이지로 이동
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
        <div className="form-group">
          {/* <label>
            <input
              type="checkbox"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
            />
            비밀글
          </label> */}
          <label>
            <input
              type="checkbox"
              checked={isNotice}
              onChange={(e) => setIsNotice(e.target.checked)}
            />
            공지
          </label>
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
          <label htmlFor="file1">파일1</label>
          <input type="file" id="file1" onChange={handleFile1Change} />
        </div>
        <div className="form-group">
          <label htmlFor="file2">파일2</label>
          <input type="file" id="file2" onChange={handleFile2Change} />
        </div>
        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/notice')}>목록</button>
          <button type="submit">확인</button>
        </div>
      </form>
    </div>
  );
}

export default NoticeWrite;
