import React from 'react';

const Pagination = ({ currentPage, totalPages, pageRange, setPageRange, setCurrentPage }) => {
  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지 범위 변경 핸들러 (다음 페이지 범위로 이동)
  const handleNextPageRange = () => {
    setPageRange([pageRange[0] + 10, pageRange[1] + 10]);
    setCurrentPage(pageRange[0] + 10); // 범위 변경 후 첫 페이지로 이동
  };

  // 페이지 범위 변경 핸들러 (이전 페이지 범위로 이동)
  const handlePrevPageRange = () => {
    setPageRange([pageRange[0] - 10, pageRange[1] - 10]);
    setCurrentPage(pageRange[0] - 10); // 범위 변경 후 첫 페이지로 이동
  };

  // 페이지네이션 버튼을 생성하는 함수
  const renderPaginationButtons = () => {
    const pageButtons = [];

    // 페이지 범위 내에서 버튼 생성
    for (let i = pageRange[0]; i <= pageRange[1] && i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        {/* 이전 화살표 버튼 (10페이지 이전으로 이동) */}
        {pageRange[0] > 1 && (
          <button onClick={handlePrevPageRange} className="pagination-arrow">
            &lt;
          </button>
        )}
        {pageButtons}
        {/* 다음 화살표 버튼 (10페이지 이후로 이동) */}
        {pageRange[1] < totalPages && (
          <button onClick={handleNextPageRange} className="pagination-arrow">
            &gt;
          </button>
        )}
      </div>
    );
  };

  return <div>{renderPaginationButtons()}</div>;
};

export default Pagination;
