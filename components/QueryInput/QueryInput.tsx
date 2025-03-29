/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useRef, useEffect } from "react"
import hljs from "highlight.js/lib/core"
import sql from "highlight.js/lib/languages/sql"
import "highlight.js/styles/github-dark.css"
import React from "react"
import { toast } from "sonner"
import styles from "./queryInput.module.css"
import { Copy } from "lucide-react"
import { useStore } from "@/store/useStore"
import Papa from "papaparse"

hljs.registerLanguage("sql", sql)

function QueryInput() {
  const { addQuery, activeQuery, tables, addTable, selectedTable, setSelectedTable } = useStore()
  const [pinned, setPinned] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")
  // const [selectedTable, setSelectedTable] = useState<string>("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightedDivRef = useRef<HTMLDivElement>(null)

  const highlightQuery = (text: string) => {
    return hljs.highlight(text, { language: "sql" }).value
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const fileType = file.name.split('.').pop()?.toLowerCase()
    if (fileType !== 'csv') {
      toast.error('Please upload a CSV file.')
      return
    }

    Papa.parse(file, {
      complete: (result) => {
        toast.success('CSV file parsed successfully!')
        console.log(result.data)
        addTable(file.name, result.data)

      },
      header: true,
      error: () => {
        toast.error('Error parsing CSV file')
      }
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (textareaRef.current && highlightedDivRef.current) {
        highlightedDivRef.current.scrollTop = textareaRef.current.scrollTop
        highlightedDivRef.current.scrollLeft = textareaRef.current.scrollLeft
      }
    }

    const textarea = textareaRef.current
    textarea?.addEventListener("scroll", handleScroll)

    return () => {
      textarea?.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (activeQuery) {
      setQuery(activeQuery.query)
      setPinned(activeQuery.pinned)
      setSelectedTable(activeQuery.table)
    } else {
      setQuery("")
      setPinned(false)
    }
  }, [activeQuery, setSelectedTable])

  return (
    <div>
      <div className={styles.editorContainer}>
        <div
          ref={highlightedDivRef}
          className={styles.highlightedQuery}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: highlightQuery(query) }}
        />
        <textarea
          ref={textareaRef}
          className={styles.textinput}
          placeholder="Enter your query here"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck="false"
        />
      </div>
      <select 
        name="tables" 
        id="tables" 
        className={styles.select} 
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
      >
        <option value="" className={styles.option}>Choose a Table</option>
        {Object.keys(tables).map((tableName) => (
          <option key={tableName} value={tableName} className={styles.option}>
        {tableName}
          </option>
        ))}
      </select>
      <div className={styles.buttonContainer}>
        <div className={styles.rectangularButtons}>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              if (!query) {
                toast.error("Enter a query first!")
                return
              }
              addQuery({
                id: crypto.randomUUID(),
                query,
                pinned: pinned,
                table: selectedTable,
              })
              toast.success("Query executed!")
            }}
          >
            Execute Query
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              setQuery("")
              textareaRef.current?.focus()
              toast.success("Query cleared!")
            }}
          >
            <span>Clear Query</span>
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.copyButton}`}
            onClick={() => {
              navigator.clipboard.writeText(query)
              toast.success("Query copied to clipboard!")
            }}
            title="Copy to clipboard"
          >
            <Copy className={styles.copyIcon} />
          </button>
        </div>
      </div>
      {/* CSV Upload and Conversion Section */}
      <div className={styles.buttonContainer}>
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

    </div>
  )
}

export default QueryInput
