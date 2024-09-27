import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaSearchPlus, FaSearchMinus } from 'react-icons/fa'; // 확대/축소 아이콘 사용

const ZoomableImage = ({ src }) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const openZoomModal = () => {
    setIsZoomModalOpen(true);
  };

  const closeZoomModal = () => {
    setIsZoomModalOpen(false);
  };

  const handleZoomIn = () => {
    setZoomLevel(prevZoom => Math.min(prevZoom + 0.5, 3)); // 최대 3배 확대
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 0.5, 1)); // 최소 1배 축소
  };

  return (
    <div>
      <img
        src={src}
        alt="차량 사진"
        style={{ width: '300px', cursor: 'pointer' }}
        onClick={openZoomModal} // 이미지 클릭 시 확대 모달 열림
      />
      <p>이미지를 클릭하면 확대됩니다.</p>

      <Modal
        isOpen={isZoomModalOpen}
        onRequestClose={closeZoomModal}
        contentLabel="Zoomed Image"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>이미지 확대</h2>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <img
            src={src}
            alt="확대된 이미지"
            style={{ maxWidth: `${zoomLevel * 100}%`, transition: 'transform 0.25s ease' }}
          />
          <div style={{ position: 'absolute', top: 10, right: 10 }}>
            <FaSearchPlus onClick={handleZoomIn} style={{ cursor: 'pointer', marginRight: '10px' }} />
            <FaSearchMinus onClick={handleZoomOut} style={{ cursor: 'pointer' }} />
          </div>
        </div>
        <button onClick={closeZoomModal}>닫기</button>
      </Modal>
    </div>
  );
};

export default ZoomableImage;
