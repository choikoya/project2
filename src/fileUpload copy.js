import React, { useState, useEffect } from 'react';
import './fileUpload.css';

function FileUpload() {
  const [file, setFile] = useState(null); //파일객체
  const [preview, setPreview] = useState(null); // 미리보기 URL
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // 분석 실패 시 사용할 상태

    // 파일이 변경될 때 미리보기 URL 생성
  useEffect(() => {
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);

      // 컴포넌트 언마운트 또는 파일 변경 시 URL 해제
      return () => URL.revokeObjectURL(previewURL);
    }
  }, [file]);



    // 파일 선택 시 처리
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile); // 파일 객체 저장
    setResult(null); // 결과 초기화
    setLoading(false); // 로딩 상태 초기화
    setError(false); // 에러 상태 초기화
    

  };

   // 백엔드에 파일 전송 및 분석 요청
  const handleAnalyze = async() => {
    if (!file) return;

    setLoading(true); // 분석 시작 시 로딩 표시
    setError(false); // 에러 상태 초기화

    const formData = new FormData();
    formData.append('file', file); // 파일 데이터를 FormData로 감싸서 전송


    try {
        // 백엔드 API 호출
        const response = await fetch('http://localhost:8080/analyze', { // 백엔드 URL
          method: 'POST',
          body: formData, // FormData 객체를 전송
        });

        const data = await response.json();

    
        
      setLoading(false); // 로딩 중 상태 해제
      if (data.success) {
        setResult(`분석완료: ${data.result}`); // 분석 결과가 있을 때 표시
      } else {
        setResult(null);
        setError(true); // 분석 실패 시 에러 처리
    }
  } catch (error) {
    console.error('분석 요청 중 오류 발생:', error);
    setLoading(false);
    setError(true); // 요청 실패 시 에러 처리
  }
};

  return (
    <div className="file-upload-container">
      <div className="left-section">
        <div className="upload-section">
          <div className="upload-header">
            <i className="fas fa-upload"></i> {/* 업로드 아이콘 */}
            <label className="upload-label">Upload your files</label>
          </div>
          <div className="upload-box">
            <input type="file" id="file-upload" onChange={handleFileUpload} />
            <label htmlFor="file-upload" className="custom-file-upload">
              Click to select or drag & drop
            </label>
          </div>
        </div>
        
        {file && (
          <div className="image-preview">
          {/* 미리보기 URL을 사용해 이미지 표시 */}
            <img src={preview} alt="uploaded" className="uploaded-image" />
          </div>
        )}

        {file && (
          <div className="button-container">
            <button className="analyze-button" onClick={handleAnalyze}>
              분석
            </button>
            <button className="next-button">
              Next
            </button>
          </div>
        )}
      </div>

      <div className="divider"></div>

      <div className="right-section">
        {loading && <div className="loading-message">로딩 중...</div>}
        {!loading && result && (
          <div className="result-section">
            <button className="recognized-button blinking">
              분석완료
            </button>
            <div className="number-plate">
              <h3>{result}</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;