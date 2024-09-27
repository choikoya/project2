import React, { useState, useEffect } from 'react';
import './fileUpload.css';

function FileUpload() {
  const [files, setFiles] = useState([]); // 업로드된 파일 객체 배열
  const [previews, setPreviews] = useState([]); // 미리보기 URL
  const [results, setResults] = useState([]); // 분석 텍스트 결과
  const [analyzedImageUrls, setAnalyzedImageUrls] = useState([]); // 분석된 이미지
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 표시된 분석 결과 인덱스 URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false); // 분석 실패 시 사용할 상태

  // 파일이 변경될 때 미리보기 URL 생성
  useEffect(() => {
    if (files.length > 0) {
      const previewURLs = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(previewURLs);

      // 컴포넌트 언마운트 또는 파일 변경 시 URL 해제
      return () => previewURLs.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [files]);


  const token = sessionStorage.getItem('authToken')
  console.log("token", token)
  // 파일 선택 시 처리
  const handleFileUpload = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles); // 파일 객체 저장
    setResults([]); // 결과 초기화
    setAnalyzedImageUrls([]); // 분석된 이미지 URL 초기화
    setLoading(false); // 로딩 상태 초기화
    setError(false); // 에러 상태 초기화
    setCurrentIndex(0); // 현재 인덱스 초기화


  };

  // 백엔드에 파일 전송 및 분석 요청
  const handleAnalyze = async () => {
    if (files.length === 0) return;

    setLoading(true); // 분석 시작 시 로딩 표시
    setError(false); // 에러 상태 초기화

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file)); // 'files'로 전송


    try {
      // 백엔드 API 호출
      const response = await fetch('http://192.168.0.142:8080/images/imagesFolder', { // 백엔드 URL
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Authorization 헤더에 토큰 추가
          //  'Content-Type': 'multipart/form-data' // JSON 형식으로 보낼 때 필요한 헤더
        },
        body: formData, // FormData 객체를 전송
      });

       // 서버에서 JSON 응답이 없는 경우에 대한 처리
      if (response.ok) {
        const data = await response.json();// 서버에서 JSON 응답 처리

       // 서버에서 올바른 구조로 응답하는지 확인하고 처리
       if (Array.isArray(data.resultTexts) && Array.isArray(data.analyzedImageUrls)) {  
        setResults(data.resultTexts); // 분석 텍스트 결과 배열 저장
        setAnalyzedImageUrls(
          data.analyzedImageUrls.map(
            (url) => `http://192.168.0.142:8080/uploads/${url}`
          )
        );
      } else {
        throw new Error("응답 데이터 구조가 예상과 다릅니다");
      }
    } else {
      throw new Error('파일 업로드 실패');
    }
    setLoading(false); // 로딩 중 상태 해제
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
      setLoading(false);
      setError(true); // 요청 실패 시 에러 처리
    }
    //   const data = await response.json();



    //   setLoading(false); // 로딩 중 상태 해제
    //   if (data.success) {
    //     setResults(data.resultTexts); // 분석 텍스트 결과 배열 저장
    //     setAnalyzedImageUrls(
    //       data.analyzedImageUrls.map(
    //         (url) => `http://192.168.0.142:8080/uploads/${url}`)); // 분석된 이미지 URL
    //   } else {
    //     setResults([]);
    //     setError(true); // 분석 실패 시 에러 처리
    //   }
    // } catch (error) {
    //   console.error('분석 요청 중 오류 발생:', error);
    //   setLoading(false);
    //   setError(true); // 요청 실패 시 에러 처리
    // }
  };

    // Next 버튼 클릭 시 다음 결과로 이동
    const handleNext = () => {
      if (currentIndex < results.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    };
  
    // Previous 버튼 클릭 시 이전 결과로 이동 (Optional)
    const handlePrevious = () => {
      if (currentIndex > 0) {
        setCurrentIndex((prevIndex) => prevIndex - 1);
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
            <input 
            type="file" 
            id="file-upload" 
            onChange={handleFileUpload} 
            multiple/>
             {/* 여러 파일 선택 가능 */}
            <label htmlFor="file-upload" className="custom-file-upload">
              Click to select or drag & drop
            </label>
          </div>
        </div>

        {previews.length > 0 &&  (
          <div className="image-preview">
            {/* 미리보기 URL을 사용해 이미지 표시 */}
            {Array.from(previews).map((preview, index) => (
            <img 
              key={index}
              src={preview} 
              alt={`uploaded-preview-${index}`}
              className="uploaded-image" />
            ))}
          </div>
        )}

        {files.length > 0 && (
          <div className="button-container">
            <button className="analyze-button" onClick={handleAnalyze}>
              분석
            </button>
            {/* <button className="next-button">
              Next
            </button> */}
          </div>
        )}
      </div>

      <div className="divider"></div>

      <div className="right-section">
        {loading && <div className="loading-message">로딩 중...</div>}

        {/* 분석 결과 텍스트 및 분석된 이미지 출력 */}
        {!loading && results.length > 0 && (
          <div className="result-section">
            <button className="recognized-button blinking">
              분석완료
            </button>
            <div className="number-plate">
              <h3>{results[currentIndex]}</h3>
            </div>
            {analyzedImageUrls[currentIndex] && (
              <div className="image-preview">
                <img 
                   src={analyzedImageUrls[currentIndex]}
                   alt={`Analyzed result ${currentIndex}`}
                />
              </div>
            )}
            <div className="navigation-buttons">
              {currentIndex > 0 && (
                <button className="previous-button" onClick={handlePrevious}>
                  Previous
                </button>
              )}
              {currentIndex < results.length - 1 && (
                <button className="next-button" onClick={handleNext}>
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            분석 중 오류가 발생했습니다. 다시 시도해주세요.
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;