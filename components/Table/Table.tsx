import React, { useEffect, useState } from "react"
import styles from "./table.module.css"
import { useStore } from "@/store/useStore"
import { Search, X } from "lucide-react"
import UploadCsvButton from "./UploadCsvButton"
import Pagination from "./Pagination"
import DownloadCsvButton from "./DownloadCsvButton"
import { toast } from "sonner"
import Papa from "papaparse";
function Table() {
  const { tables, selectedTable, addTable, setSelectedTable } = useStore()
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

  const defaultFile = async () => {
    try {
      Papa.parse(
        "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv",
        {
          download: true,
          header: true,
          complete: (result) => {
            if (result.data && result.data.length > 0) {
              addTable("default.csv", result.data)
              setSelectedTable("default.csv")
            } else {
              toast.error("The CSV file appears to be empty")
            }
          },
          error: (error) => {
            toast.error(`Error parsing CSV file: ${error.message}`)
          },
        }
      )
    } catch (error) {
      toast.error(
        `Failed to load default CSV file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      )
    }
  }

  useEffect(() => {
    defaultFile()
  })




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
                <span className={styles.buttonGroup}>
                <UploadCsvButton />
                <DownloadCsvButton
                  selectedTable={selectedTable}
                  tables={tables}
                  filteredRows={filteredRows}
                  searchTerm={searchTerm}
                />
                </span>
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
