import React from 'react'
import styles from "./table.module.css"
import { toast } from 'sonner'
import { useStore } from '@/store/useStore'
import Papa from "papaparse"
function UploadCsvButton() {
  const {
    addTable,
    setSelectedTable,
  } = useStore()
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return
    
        const fileType = file.name.split(".").pop()?.toLowerCase()
        if (fileType !== "csv") {
          toast.error("Please upload a CSV file.")
          return
        }
    
        Papa.parse(file, {
          complete: (result) => {
            toast.success("CSV file parsed successfully!")
            addTable(file.name, result.data)
            setSelectedTable(file.name)
          },
          header: true,
          error: () => {
            toast.error("Error parsing CSV file")
          },
        })
      }
  return (
    <div>
        <div className={styles.rectangularButtons}>
          <input
            type="file"
            id="csvUpload"
            accept=".csv"
            onChange={handleFileUpload}
            className={styles.hiddenFileInput}
          />
          <label htmlFor="csvUpload" className={styles.button}>
            Upload CSV
          </label>
        </div>
    </div>
  )
}

export default UploadCsvButton