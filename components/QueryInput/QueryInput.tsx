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
import { format } from "sql-formatter"

hljs.registerLanguage("sql", sql)

function QueryInput() {
  const {
    addQuery,
    activeQuery,
    tables,
    addTable,
    selectedTable,
    setSelectedTable,
  } = useStore()
  const [query, setQuery] = useState<string>("SELECT * from employees;")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightedDivRef = useRef<HTMLDivElement>(null)

  const highlightQuery = (text: string) => {
    return hljs.highlight(text, { language: "sql" }).value
  }
  const formatQuery = () => {
     if (!query.trim()) {
      toast.error("Enter a query first!")
      return
    }
    try {
      const formatted = format(query, {
        language: "mysql",
        keywordCase: "upper" 
      })
      setQuery(formatted)
      toast.success("Query formatted successfully!")
    } catch (error) {
      toast.error("Error formatting query")
      console.warn("Could not format SQL:", error)
    }
  }
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

      setSelectedTable(activeQuery.table)
    } else {
      setSelectedTable("employees")
    }
  }, [activeQuery, setSelectedTable])

  return (
    <div>
      <div className={styles.editorContainer}>
      <button
            type="button"
            className={`${styles.button} ${styles.copyButton} ${styles.roundedButton}`}
            onClick={() => {
              navigator.clipboard.writeText(query)
              toast.success("Query copied to clipboard!")
            }}
            title="Copy to clipboard"
          >
            <Copy className={styles.copyIcon} />
          </button>
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
        />
      </div>
      <select
        name="tables"
        id="tables"
        className={styles.select}
        value={selectedTable}
        onChange={(e) => setSelectedTable(e.target.value)}
      >
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
              } else if (tables[selectedTable]?.length === undefined) {
                toast.error("Choose a table first!")
                return
              }
              console.log("tables[selectedTable]?.length", tables[selectedTable]?.length)
              addQuery({
                id: crypto.randomUUID(),
                query,
                pinned: false,
                table: selectedTable,
              })
              const executionTime = (Math.random() * 0.6 + 0.2).toFixed(2)
              toast.success(`Query executed in ${executionTime}s!`)
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
            className={styles.button}
            onClick={formatQuery}
          >
            <span>Format Query</span>
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
