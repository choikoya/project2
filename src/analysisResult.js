import React, { useState, useEffect } from 'react';

function AnalysisResult() {
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [resultImage, setResultImage] = useState(null);
  const [resultText, setResultText] = useState('');
  const [isAnalyzed, setIsAnalyzed] = useState(false);

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

      // 수신한 데이터를 사용하여 데이터 필드에 맞게 상태 업데이트
      setLeftImage(`ws://192.168.0.142:8080/ws/${data.leftImage}`);
      setRightImage(`ws://192.168.0.142:8080/ws/${data.rightImage}`);
      setFileName(data.fileName);
      setResultImage(`ws://192.168.0.142:8080/ws/${data.resultImage}`);
      setResultText(data.resultText);
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
