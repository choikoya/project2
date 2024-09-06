import React, { useState } from 'react';
import axios from 'axios';
function MultipleFileUpload() {
const [selectedFiles, setSelectedFiles] = useState([]);

const [buttonText, setButtonText] = useState('Analysis Start');

const [result, setResult] = useState(null);
const [isProcessing, setIsProcessing] = useState(false);
const [message, setMessage] = useState('');
const [inputFullNumber, setInputFullNumber] = useState('');

const token =sessionStorage.getItem("authToken")
// 파일 선택 시 호출되는 함수
const handleFileChange = (e) => {
    setSelectedFiles(e.target.files); // 선택된 파일들을 상태에 저장
};

// 파일 업로드 처리 함수
const handleUpload = async () => {
    if (selectedFiles.length === 0) {
        alert('No files selected.');
        return;
    }

    const formData = new FormData();
    
    // 선택된 파일들을 FormData에 추가
    for (const file of selectedFiles) {
        formData.append('files', file);
    }

    try {
        const response = await fetch('http://192.168.0.142:8080/images/imagesFolder', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            alert('Files uploaded and analyzed successfully!');
        } else {
            alert('Failed to upload and analyze files.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during the file upload.');
    }
};


    // 이미지 처리 시작 함수
    const handleAnalysis = async () => {
      if (!isProcessing) {
          setButtonText('Analyzing...');
          setIsProcessing(true);
          

          try {
              const response = await fetch('http://192.168.0.142:8080/images/processImagesTest', {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`,
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
          // 'Next' 버튼 클릭 시 추가 처리 로직
          console.log('Proceeding to next step...');
      }
  };

  const getBorderColor = () => {
    if (result) {
        switch (result.recognize) {
            case "인식성공100":
                return 'green'; // 인식 성공 100일 때 녹색
            case "인식성공50":
                return 'yellow'; // 인식 성공 50일 때 노란색
            default:
                return 'gray'; // 기본 색상
        }
    }
    return 'gray'; // 결과가 없을 때 기본 색상
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
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
              name: result.name,
              fullnumber: inputFullNumber,
          }),
      });

      if (response.ok) {
          console.log('Update successful');
          // 추가적인 처리 (예: 사용자에게 알림)
      } else {
          console.error('Update failed');
          // 추가적인 처리 (예: 사용자에게 오류 알림)
      }
  } catch (error) {
      console.error('Error:', error);
      // 추가적인 처리 (예: 사용자에게 오류 알림)
  }
};
return (
    <div>
        <h1>Upload Multiple Images and View Analysis Result</h1>
        <input
            type="file"
            onChange={handleFileChange}
            multiple // 여러 파일 선택 가능
        />
        <button onClick={handleUpload} style={{
                backgroundColor: 'blue',  color: 'white',   borderRadius: '5px',     }}>Upload</button>
     
     <button
                onClick={handleAnalysis}
                disabled={isProcessing} style={{
                  backgroundColor: 'red',  color: 'white',   borderRadius: '5px',     }}
            >
                {buttonText}
            </button>
           
            {result && !result.name2 && (
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
            {result && result.recognize === "인식성공50" && (
                <div>
                    <form className="inputfullnumber-form" onSubmit={updateRecognize}>
                        <input
                            type="text"
                            placeholder="번호판 직접 입력해주세요"
                            className="input-field"
                            value={inputFullNumber}
                            onChange={(e) => setInputFullNumber(e.target.value)} // 입력 값 변경 처리
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}

    </div>

    
);
}
export default MultipleFileUpload;