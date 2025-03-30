import React, { useState } from "react"
import styles from "./table.module.css"
import { useStore } from "@/store/useStore"
import { Search, X } from "lucide-react"
import UploadCsvButton from "./UploadCsvButton"
import Pagination from "./Pagination"

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

  const totalRows = filteredRows.length
  const totalPages = Math.ceil(totalRows / rowsPerPage)
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

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
                <UploadCsvButton />

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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        paginate={paginate}
      />
    </div>
  )
}

export default Table
