import React, { useState, useEffect } from 'react';
import './css/analysisResult.css';
import { useNavigate } from 'react-router-dom';

function AnalysisResult() {
  const [inputImages, setInputImages] = useState([]);
  const [outputImages, setOutputImages] = useState([]);
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);
  const [fullnumber, setFullnumber] = useState(null);
  const [weighbridgename, setWeighbridgename] = useState(null);
  const [junkyardname, setJunkyardname] = useState(null);
  const navigate = useNavigate();
  const [firstMessageTime, setFirstMessageTime] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    if (!token) {
      alert('토큰이 없습니다. 로그인을 먼저 해주세요.');
      navigate('/');
    }

    if (role !== "ROLE_ADMIN") {
      alert('관리자만 접근 가능합니다.');
      navigate('/notice');
    }

    const socket = new WebSocket(`ws://192.168.0.142:8080/ws`);

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("data", data);

      // Update input and output images
      setInputImages(data.inputImages);
      setOutputImages(data.outputImages);

      // Check if it's the first message
      if (firstMessageTime === null) {
        setFirstMessageTime(Date.now()); // Set the first message time
        await analyzeImages(data.inputImages, data.outputImages);
      } else {
        // Check if an hour has passed since the first message
        if (Date.now() - firstMessageTime >= 3600000) { // 3600000 ms = 1 hour
          setFirstMessageTime(Date.now()); // Update to the current time
          await analyzeImages(data.inputImages, data.outputImages);
        }
      }
    };

    // Handle error
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, [firstMessageTime]); // Dependency on firstMessageTime

  const analyzeImages = async (inputImages, outputImages) => {
    setLeftImage(inputImages[0]?.weighbridgename);
    await new Promise(resolve => setTimeout(resolve, 5000));

    for (let i = 1; i < inputImages.length; i++) {
      setLeftImage(inputImages[i]?.weighbridgename); // 왼쪽 이미지 설정
      setRightImage(outputImages[i - 1]?.junkyardname); // 오른쪽 이미지 설정
      if (outputImages[i - 1]?.fullnumber === inputImages[i - 1]?.fullnumber) {
        setFullnumber(outputImages[i - 1]?.fullnumber);
        const filename1 = inputImages[i - 1]?.weighbridgename; // "2024-09-24_12-45-45.jpg"
        const filename2 = outputImages[i - 1]?.junkyardname; // "2024-09-24_12-45-45.jpg"
        setWeighbridgename(filename1.substring(0, filename1.length - 4));
        setJunkyardname(filename2.substring(0, filename2.length - 4));
      }

      // 30초 대기
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    setRightImage(outputImages[outputImages.length-1].junkyardname); // 오른쪽 이미지 설정
  };

  return (
    <div className="result-page">
      <h2>cctv-계근장, 고철장 </h2>
      <div className="image-result">
        <div className="image-box">
          {leftImage ? (
            <img 
              src={`http://localhost:8080/image/${leftImage}`} 
              alt="Left Image" 
            />
          ) : (
            <p>계근대 번호판 사진</p>
          )}
        </div>
        <div className="image-box">
          {rightImage ? (
            <img 
              src={`http://localhost:8080/image/${rightImage}`} 
              alt="Right Image" 
            />
          ) : (
            <p>트럭 사진</p>
          )}
        </div>
      </div>
      <div className={`result-box`}> 
        <p className="result-text">
          차량번호 ({fullnumber})<br />
          계근장 입차완료 ({weighbridgename})<br />
          고철장 입차완료 ({junkyardname})
        </p>
      </div>
    </div>
  );
}

export default AnalysisResult;