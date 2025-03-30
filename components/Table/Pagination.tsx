import React from "react"
import styles from "./table.module.css"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalRows: number
  rowsPerPage: number
  paginate: (pageNumber: number) => void
}

function Pagination({
  currentPage,
  totalPages,
  totalRows,
  rowsPerPage,
  paginate,
}: PaginationProps) {
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage

  const goToFirstPage = () => paginate(1)
  const goToLastPage = () => paginate(totalPages)
  const goToNextPage = () => {
    if (currentPage < totalPages) paginate(currentPage + 1)
  }
  const goToPrevPage = () => {
    if (currentPage > 1) paginate(currentPage - 1)
  }

  return (
    <div className={styles.paginationControls}>
      <div className={styles.paginationInfo}>
        Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, totalRows)}{" "}
        of {totalRows} entries
      </div>

      <div className={styles.paginationButtons}>
        <button
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className={styles.paginationButton}
        >
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
          let pageNumber
          if (totalPages <= 5) {
            pageNumber = i + 1
          } else if (currentPage <= 3) {
            pageNumber = i + 1
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + i
          } else {
            pageNumber = currentPage - 2 + i
          }

          return (
            <button
              key={pageNumber}
              onClick={() => paginate(pageNumber)}
              className={`${styles.paginationButton} ${
                currentPage === pageNumber ? styles.activePage : ""
              }`}
            >
              {pageNumber}
            </button>
          )
        })}

        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={goToLastPage}
          disabled={currentPage === totalPages}
          className={styles.paginationButton}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
