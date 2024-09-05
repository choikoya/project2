import React, { useState } from 'react';
import axios from 'axios';

const ImageUploadAndResult = () => {
  const [selectedImage, setSelectedImage] = useState(null); // 사용자가 선택한 이미지
  const [uploadedImageUrl, setUploadedImageUrl] = useState(''); // 서버에서 반환된 이미지 경로
  const [analysisText, setAnalysisText] = useState(''); // 서버에서 반환된 분석 텍스트
  const [analyzedImageUrl, setAnalyzedImageUrl] = useState(''); // 서버에서 반환된 분석된 이미지 URL

  // 이미지 선택 핸들러
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  // 이미지 업로드 핸들러
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      // 이미지 파일을 백엔드에 업로드
      const uploadResponse = await axios.post('http://192.168.0.142:8080/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const analysisId = uploadResponse.data.analysisId; // 서버에서 분석 ID를 반환
      console.log("Analysis ID:", analysisId);

      // 업로드 후 분석된 데이터를 받아오기
      fetchAnalysisResult(analysisId);
    } catch (error) {
      console.error('Error uploading the image', error);
    }
  };

  // 분석 결과 요청 핸들러
  const fetchAnalysisResult = async (analysisId) => {
    try {
      // 서버로부터 분석 결과 요청
      const resultResponse = await axios.get(`http://192.168.0.142:8080/api/result/${analysisId}`);

      // 서버에서 받은 분석된 이미지 URL과 분석 텍스트 저장
      setAnalyzedImageUrl(resultResponse.data.analyzedImageUrl);
      setAnalysisText(resultResponse.data.analysisText);
    } catch (error) {
      console.error('Error fetching analysis result', error);
    }
  };

  return (
    <div>
      <h1>Upload Image and View Analysis Result</h1>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload and Analyze</button>

      {/* 업로드된 이미지 미리보기 */}
      {uploadedImageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={`http://192.168.0.142:8080${uploadedImageUrl}`} alt="Uploaded" style={{ width: '300px', height: 'auto' }} />
        </div>
      )}

      {/* 분석 결과 출력: 분석된 이미지 및 분석된 텍스트 */}
      {analyzedImageUrl && (
        <div>
          <h3>Analyzed Image:</h3>
          <img src={`http://192.168.0.142:8080${analyzedImageUrl}`} alt="Analyzed Result" style={{ width: '300px', height: 'auto' }} />
        </div>
      )}

      {analysisText && (
        <div>
          <h3>Analysis Result Text:</h3>
          <p>{analysisText}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploadAndResult;
