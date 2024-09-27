import React from 'react';
import Modal from 'react-modal';
import '../css/messageModal.css';

const MessageModal = ({ isOpen, onRequestClose, messageContent, setMessageContent, handleSendMessage }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    contentLabel="Send Message"
    className="modal"
    overlayClassName="modal-overlay"
  >
    <h2>관리자 주의 메시지 전송</h2>
    <textarea
      value={messageContent}
      onChange={(e) => setMessageContent(e.target.value)}
      placeholder="메시지를 입력하세요"
      className="message-textarea"
    />
    <div className="modal-buttons">
      <button className="send-button" onClick={handleSendMessage}>보내기</button>
      <button className="cancel-button" onClick={onRequestClose}>취소</button>
    </div>
  </Modal>
);

export default MessageModal;
