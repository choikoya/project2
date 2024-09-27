import React, { useEffect, useState } from 'react';
import '../css/modal.css'; // 스타일 파일 (필요 시)
import ZoomableImage from './ZoomableImage'; // ZoomableImage 컴포넌트 import

const Modal = ({ selectedCar, newCarNumber, setNewCarNumber, onSave, onClose }) => {
  const [photoUrl, setPhotoUrl] = useState('');

  // 임의의 번호판 사진 URL 배열
  const randomPhotos = [
    'https://via.placeholder.com/300x150?text=License+Plate+1',
    'https://via.placeholder.com/300x150?text=License+Plate+2',
    'https://via.placeholder.com/300x150?text=License+Plate+3',
  ];

  // 모달이 열릴 때 서버에서 사진을 가져오는 로직
  useEffect(() => {
    if (selectedCar) {
      // 임시로 랜덤 사진을 보여줍니다.
      const randomPhoto = randomPhotos[Math.floor(Math.random() * randomPhotos.length)];
      setPhotoUrl(randomPhoto);
    }
  }, [selectedCar]);

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>차량번호 수정</h2>
        
        {photoUrl && <img src={photoUrl} alt="차량 사진" style={{ width: '300px' }} />}
        <div>
          <label>차량번호: </label>
          <input
            type="text"
            value={newCarNumber}
            onChange={(e) => setNewCarNumber(e.target.value)}
          />
        </div>
        <button onClick={onSave}>수정</button>
        <button onClick={onClose}>취소</button>
      </div>
    </div>
  );
};

export default Modal;
