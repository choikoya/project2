import React, { useState, useEffect } from 'react';
import './fileUpload.css';

function MultipleFileUpload() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]); // 미리보기 URL
  const [buttonText, setButtonText] = useState('Analysis Start');
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [inputFullNumber, setInputFullNumber] = useState('');
  const token = sessionStorage.getItem("authToken");

  // 파일 선택 시 호출되는 함수
  const handleFileChange = async(e) => {
    const files = Array.from(e.target.files); // 파일들을 배열로 변환
    setSelectedFiles(files); // 선택된 파일들을 상태에 저장

    // 미리보기 URL 생성
    const previewURLs = files.map((file) => URL.createObjectURL(file));
    setPreviews(previewURLs);

      // 파일 선택 후 자동으로 업로드 실행
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }



  // 파일 업로드 처리 함수(submit을 눌러야 업로드)
  // const handleUpload = async () => {
  //   if (selectedFiles.length === 0) {
  //     alert('No files selected.');
  //     return;
  //   }

  //   const formData = new FormData();

  //   // 선택된 파일들을 FormData에 추가
  //   for (const file of selectedFiles) {
  //     formData.append('files', file);
  //   }


  

    try {
      const response = await fetch('http://192.168.0.142:8080/images/imagesFolder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('사진 업로드 성공');
      } else {
        alert('사진 업로드 실패');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('업로드 중 오류 발생');
    }
  };

  // 이미지 처리 시작 함수
  const handleAnalysis = async () => {
    if (!isProcessing) {
      setButtonText('분석중...');
      setIsProcessing(true);

      try {
        const response = await fetch('http://192.168.0.142:8080/images/processImages', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setResult(data);
          if (data.name2) {
            setMessage('Analysis Successful');
            setButtonText('Next');
          } else {
            setMessage('Analysis Failed: No image found');
            setButtonText('Start');
          }
        } else {
          setMessage('Analysis Failed: Server error');
          setButtonText('Start');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('Analysis Failed: An error occurred');
        setButtonText('Start');
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.log('Proceeding to next step...');
    }
  };

  const getBorderColor = () => {
    if (result) {
      switch (result.recognize) {
        case '인식성공100':
          return 'green';
        case '인식성공50':
          return 'yellow';
        default:
          return 'gray';
      }
    }
    return 'gray';
  };

  const divStyle = {
    border: `3px solid ${getBorderColor()}`, // 테두리 두께 및 색상
    borderRadius: '10px', // 모서리 둥글게
    padding: '20px', // 내부 여백
    margin: '20px', // 외부 여백
  };

  // 번호판 사용자 업로드 함수
  const updateRecognize = async (event) => {
    event.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    try {
      const response = await fetch('http://192.168.0.142:8080/images/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.name,
          fullnumber: inputFullNumber,
        }),
      });

      if (response.ok) {
        console.log('Update successful');
        alert('번호판 수정 성공!');
      } else {
        console.error('Update failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="file-upload-container">
      <div className="left-section">
        <div className="upload-section">
          <div className="upload-header">
            <label className="upload-label">Upload your files</label>
          </div>
          <div className="upload-box">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              multiple
            />
            <label htmlFor="file-upload" className="custom-file-upload">
              Drag and drop files here
            </label>
          </div>
        </div>

        <div className="preview-section">
          {previews.length > 0 && (
            <div className="preview-box">
              {previews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`uploaded-preview-${index}`}
                  className="uploaded-image"
                />
              ))}
            </div>
          )}
        </div>

        {selectedFiles.length > 0 && (
          <div className="button-container">
            {/* <button className="upload-button" onClick={handleUpload}>
              Submit
            </button> */}
            <button
              className="analyze-button"
              onClick={handleAnalysis}
              disabled={isProcessing}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>

      <div className="right-section">
        {result && result.name2 === '미정' && (
          <div style={divStyle}>
            <h2>Analysis result:</h2>
            <p>{message}</p>
          </div>
        )}

        {result && result.name2 && (
          <div style={divStyle}>
            <h2>Analysis result:</h2>
            <p>{message}</p>
            <img
              src={`http://192.168.0.142:8080/image/${result.name2}`}
              alt="Processed Content"
              style={{ maxWidth: '100%', height: 'auto' }}
              onError={(e) => {
                e.target.src = 'path/to/placeholder-image.jpg'; // 이미지 로드 실패 시 대체 이미지
              }}
            />
            <p>{result.fullnumber}</p>
          </div>
        )}

        {result && result.recognize === '인식성공50' && (
          <div>
            <form className="inputfullnumber-form" onSubmit={updateRecognize}>
              <input
                type="text"
                placeholder="번호판 직접 입력해주세요"
                className="input-field"
                value={inputFullNumber}
                onChange={(e) => setInputFullNumber(e.target.value)}
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default MultipleFileUpload;
