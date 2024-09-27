import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '../css/timeTableRow.css';

const TimeTableRow = ({ row, index, handleCellClick, handleOpenMessageModal, currentPage, dataPerPage, parseDateFromName }) => {
  return (
    <tr key={index}>
      <td>{(currentPage - 1) * dataPerPage + index + 1}</td>
      <td style={{ cursor: 'pointer', color: 'blue' }} onClick={() => handleCellClick(row)}>
        {row.fullnumber}
      </td>
      <td>
        {
          row.weighbridgename 
            ? parseDateFromName(row.weighbridgename)?.toLocaleString() 
            : row.junkyardname 
            ? parseDateFromName(row.junkyardname)?.toLocaleString() 
            : 'Invalid Date'
        }
      </td>
      <td>{row.place}</td>
      <td>{row.recognize}</td>
      <td>{row.cartype}</td>
      <td>
        <button onClick={() => handleOpenMessageModal(row)}>
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
      </td>
    </tr>
  );
};

export default TimeTableRow;
