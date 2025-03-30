import React, { useState } from "react"
import styles from "./table.module.css"
import { useStore } from "@/store/useStore"
import { Search, X } from "lucide-react"

function Table() {
  const { tables, selectedTable } = useStore()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRows =
    selectedTable && tables[selectedTable]
      ? tables[selectedTable].filter((row) =>
          Object.values(row as Record<string, any>).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : []

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
        }}
      />

      <X onClick={()=> setSearchTerm("")} />

      </div>
      </div>

      <div className={styles.csvJsonSection}>
        {selectedTable && tables[selectedTable] && (
          <div className={styles.csvTableWrapper}>
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
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row: any, rowIndex) => (
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
        )}
      </div>
    </div>
  )
}

export default Table
