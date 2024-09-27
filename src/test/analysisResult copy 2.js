// v1.

import React, { useState, useEffect } from 'react';
import './analysisResult.css';

function AnalysisResult() {
  
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [resultImage, setResultImage] = useState(null);
  const [resultText, setResultText] = useState('');
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [recognizeStatus, setRecognizeStatus] = useState('분석 대기중');

  useEffect(() => {
    // 로컬 스토리지에서 토큰 가져오기
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('토큰이 없습니다. 로그인을 먼저 해주세요.');
      return;
    }

 
    // 웹소켓 연결 설정(토큰을 url에 포함)
    const socket = new WebSocket(`ws://192.168.0.133:8080/ws`);

    // 서버로부터 메시지를 받았을 때 실행되는 함수
    socket.onopen = (event) => {
      const data = JSON.parse(event.data);

      console.log("data", data);

      //필드명이 name1, 2.... 일때 각각 넣는방법 배수로?
      // 수신한 데이터를 사용하여 데이터 필드에 맞게 상태 업데이트
      setLeftImage(`ws://192.168.0.142:8080/ws/${data.name1}`);
      setRightImage(`ws://192.168.0.142:8080/ws/${data.path2}`);
      setFileName(data.name2);
      setResultImage(`ws://192.168.0.142:8080/ws/${data.resultImage}`);
      setResultText(data.status);

      // recognize 값에 따라 분석 상태 업데이트
      if (data.recognize === 100) {
        setRecognizeStatus('인식성공 100');
      } else if (data.recognize === 50) {
        setRecognizeStatus('인식성공 50');
      } else {
        setRecognizeStatus('인식불가');
      }

      setIsAnalyzed(true); // 분석 완료 상태 업데이트
    };

    // 에러 핸들링
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // 컴포넌트가 언마운트될 때 웹소켓 연결 해제
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="result-page">
      <h2>분석 이미지 조회</h2>
      <div className="image-result">
       {/* 왼쪽 이미지 박스 */}
        <div className="image-box">
          {leftImage && <img src={leftImage} alt="Left Image" />}
          <p>계근대 번호판</p>
        </div>

         {/* 오른쪽 이미지 박스 */}
        <div className="image-box">
          {rightImage && <img src={rightImage} alt="Right Image" />}
          <p>{fileName}</p>
        </div>
      </div>

 {/* 분석 결과 */}
      
        <div className="result-box">
          <p className="status">{isAnalyzed ?  recognizeStatus : "분석 대기중"}</p>
          <img src={resultImage || "/images/placeholder.png"} alt="Result Image" />
          <p className="result-text">{resultText || "결과를 기다리는 중입니다..."}</p>
        </div>
      
    </div>
  );
}

export default AnalysisResult;
