import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AnalysisResult() {
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [resultImage, setResultImage] = useState(null);
  const [resultText, setResultText] = useState('');
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const baseUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.142:8080';
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    // 백엔드에서 이미지 및 분석 데이터를 가져오는 함수
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/images/getImageData`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          // 이미지 및 데이터 세팅
          setLeftImage(`${baseUrl}/image/${response.data.leftImage}`);
          setRightImage(`${baseUrl}/image/${response.data.rightImage}`);
          setFileName(response.data.fileName);
          setResultImage(`${baseUrl}/image/${response.data.resultImage}`);
          setResultText(response.data.resultText);
          setIsAnalyzed(true);
        }
      } catch (error) {
        console.error('Error fetching image data', error);
      }
    };

    fetchData();
  }, [baseUrl, token]);

  return (
    <div className="container">
      <h2>분석 이미지 조회</h2>
      <div className="image-container">
        <div className="image-box">
          {leftImage && <img src={leftImage} alt="Left Image" />}
          <p>계근대 번호판</p>
        </div>
        <div className="image-box">
          {rightImage && <img src={rightImage} alt="Right Image" />}
          <p>{fileName}</p>
        </div>
      </div>

      {isAnalyzed && (
        <div className="result-box">
          <p>분석완료</p>
          <img src={resultImage} alt="Result Image" />
          <p>{resultText}</p>
        </div>
      )}
    </div>
  );
}

export default AnalysisResult;
