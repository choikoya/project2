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

  const [step, setStep] = useState(0); // 단계별 상태 추가

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
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("data", data);

      // 1단계: 좌측 파일명과 이미지 출력
      setFileName(data.name2);
      setLeftImage(`ws://192.168.0.133:8080/ws/${data.name1}`);
      setStep(1); // 좌측 파일명 및 이미지 출력 단계로 설정

      // 2단계: 우측 파일명과 이미지 출력 (1초 후)
      setTimeout(() => {
        setRightImage(`ws://192.168.0.133:8080/ws/${data.path2}`);
        setStep(2); // 우측 파일명 및 이미지 출력 단계로 설정
        setRecognizeStatus("분석중"); // 좌우 이미지가 뜨면 "분석중" 상태로 설정
        setResultText("결과를 기다리는 중입니다..."); // 결과 텍스트 설정
      }, 1000);

      // 3단계: 3초 후 결과 출력
      setTimeout(() => {
        setResultImage(`ws://192.168.0.133:8080/ws/${data.resultImage}`);
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
        setStep(3); // 결과 출력 단계로 설정
      }, 3000); // 3초 후 결과 출력
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

   // 배경색과 보더 색 동적으로 설정하기 위해 클래스를 결정
   const statusClass = `${recognizeStatus === '인식성공 100' ? 'green-background' : recognizeStatus === '인식성공 50' ? 'yellow-background' : recognizeStatus === '인식불가' ? 'red-background' : ''}`;
   const resultBoxClass = `${recognizeStatus === '인식성공 100' ? 'light-green-background' : recognizeStatus === '인식성공 50' ? 'light-yellow-background' : recognizeStatus === '인식불가' ? 'light-red-background' : ''} ${statusClass}`; // 보더 색도 같이 변경

  return (
    <div className="result-page">
      <h2>분석 이미지 조회</h2>
      <div className="image-result">
        {/* 왼쪽 이미지 박스 */}
        <div className="image-box">
          {leftImage && <img src={leftImage} alt="Left Image" />}
          <p>계근대 번호판 사진</p>
        </div>

        {/* 오른쪽 이미지 박스 */}
        <div className="image-box">
          {rightImage && <img src={rightImage} alt="Right Image" />}
          <p>트럭 사진{fileName}</p>
        </div>
      </div>

      {/* 분석 결과 폼: 항상 보여주되, 결과 내용만 단계별로 업데이트 */}
      <div className={`result-box ${resultBoxClass}`}> {/* 클래스에 따라 배경색 및 보더 색 변경 */}
        <p className={`status ${statusClass}`}>{step < 3 ? "분석중" : recognizeStatus}</p> {/* 3초 전까지 "분석중" 상태 */}
        {step >= 3 && <img src={resultImage} alt="Result Image" />} {/* 3초 후 결과 이미지 출력 */}
        <p className="result-text">{step < 3 ? "결과를 기다리는 중입니다..." : resultText}</p> {/* 결과 출력 */}
      </div>
    </div>
  );
}

export default AnalysisResult;
