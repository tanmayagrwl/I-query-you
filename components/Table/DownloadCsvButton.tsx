import React from "react"
import { toast } from "sonner"
import styles from "./table.module.css"

interface DownloadCsvButtonProps {
  selectedTable: string | null
  tables: Record<string, any[]>
  filteredRows?: any[]
  searchTerm?: string
}

const DownloadCsvButton: React.FC<DownloadCsvButtonProps> = ({
  selectedTable,
  tables,
  filteredRows = [],
  searchTerm = "",
}) => {
  const downloadCSV = () => {
    if (!selectedTable || !tables[selectedTable]) return

    try {
      const data = searchTerm ? filteredRows : tables[selectedTable]
      if (!data || data.length === 0) {
        toast.error("No data available for download")
        return
      }

      const headers = Object.keys(data[0] as Record<string, any>)
      const csvRows = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((fieldName) => {
              let value = (row as Record<string, any>)[fieldName]
              if (value === null || value === undefined) {
                value = ""
              } else if (value instanceof Date) {
                value = value.toISOString()
              } else if (typeof value === "object") {
                value = JSON.stringify(value)
              }
              const escaped = String(value).replace(/"/g, '""')
              return `"${escaped}"`
            })
            .join(",")
        ),
      ]

      const csvString = csvRows.join("\n")
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `${selectedTable}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()

      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
    } catch {
      toast.error("Error generating CSV")
    }
  }

  return (
    <div>
      <button
        onClick={downloadCSV}
        className={styles.button}
        title="Download CSV"
      >
        <div className={styles.downloadButton}> Download CSV</div>
      </button>
    </div>
  )
}

export default DownloadCsvButton
