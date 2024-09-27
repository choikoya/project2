import React from 'react';
import Modal from 'react-modal';
import '../css/vehicleEditModal.css';

const VehicleEditModal = ({ isOpen, onRequestClose, selectedRow, formData, handleChange, handleSubmit, openSecondModal }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Edit Vehicle"
    className="modal"
    overlayClassName="modal-overlay"
  >
    <h2>차량 정보 수정</h2>
    {selectedRow ? (
      <img
        src={`http://192.168.0.142:8080/image/${selectedRow.name}`} 
        alt="참고 이미지"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    ) : (
      <p>참고 이미지 없음</p>
    )}
    <form onSubmit={handleSubmit}>
      <label>
        차량번호
        <input
          type="text"
          name="fullnumber"
          value={formData.fullnumber}
          onChange={handleChange}
        />
      </label>
      <label>
        장소
        <input
          type="text"
          name="place"
          value={formData.place}
          onChange={handleChange}
        />
      </label>
      <button type="submit">저장</button>
      <button type="button" onClick={onRequestClose}>취소</button>
      <button type="button" onClick={() => openSecondModal(selectedRow)}>추가 정보 보기</button>
    </form>
  </Modal>
);

export default VehicleEditModal;
