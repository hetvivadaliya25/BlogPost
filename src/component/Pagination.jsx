import "./Pagination.css";

export const Pagination = ({ currentPage, totalPages, onPrev, onNext, pageSize, onPageSizeChange }) => {
  return (
    <div className="pagination-container">
      <div className="drop-class">

        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}>
          {/* <option value={5}>5</option> */}
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>

      <button className="pagination-btn1" onClick={onPrev} disabled={currentPage === 1}>
        PREV
      </button>
      
      <span className="pagination-info"> {currentPage} of {totalPages || 1} </span>
      
      <button className="pagination-btn2" onClick={onNext} disabled={currentPage === totalPages || totalPages === 0}>
        NEXT
      </button>
    </div>
  );
};