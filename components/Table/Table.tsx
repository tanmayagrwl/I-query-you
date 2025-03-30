import React, { useState } from "react"
import styles from "./table.module.css"
import { useStore } from "@/store/useStore"
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

function Table() {
  const { tables, selectedTable } = useStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage] = useState(10)

  const filteredRows =
    selectedTable && tables[selectedTable]
      ? tables[selectedTable].filter((row) =>
          Object.values(row as Record<string, any>).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : []

  // Pagination logic
  const totalRows = filteredRows.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)

  // Get current rows
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)
  const goToFirstPage = () => paginate(1)
  const goToLastPage = () => paginate(totalPages)
  const goToNextPage = () => {
    if (currentPage < totalPages) paginate(currentPage + 1)
  }
  const goToPrevPage = () => {
    if (currentPage > 1) paginate(currentPage - 1)
  }

  const highlightMatch = (text: string) => {
    if (!searchTerm) return text
    const regex = new RegExp(`(${searchTerm})`, "gi")
    return String(text)
      .split(regex)
      .map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={i} className={styles.highlight}>
            {part}
          </span>
        ) : (
          part
        )
      )
  }

  return (
    <div>
      <div className={styles.csvJsonSection}>
       
        {selectedTable && tables[selectedTable] && (
          <>
            <div className={styles.csvTableWrapper}>
            <div className={styles.searchSection}>
          <div className={styles.searchInputContainer}>
            <Search />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search within table..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
            <X onClick={() => setSearchTerm("")} />
          </div>
        </div>
              <div className={styles.csvTableContainer}>
                <table className={styles.csvTable}>
                  <thead>
                    <tr>
                      {Object.keys(
                        tables[selectedTable][0] as Record<string, any>
                      ).map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.length > 0 ? (
                      currentRows.map((row: any, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((cell: any, cellIndex) => (
                            <td key={cellIndex}>{highlightMatch(cell)}</td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={
                            Object.keys(
                              tables[selectedTable][0] as Record<string, any>
                            ).length
                          }
                        >
                          No matching records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
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
    </div>
  )
}

export default Table
