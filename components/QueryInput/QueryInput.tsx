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

hljs.registerLanguage("sql", sql)

function QueryInput() {
  const { addQuery, activeQuery } = useStore()
  const [pinned, setPinned] = useState<boolean>(false)
  const [query, setQuery] = useState<string>("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightedDivRef = useRef<HTMLDivElement>(null)

  const highlightQuery = (text: string) => {
    return hljs.highlight(text, { language: "sql" }).value
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
    } else {
      setQuery("")
      setPinned(false)
    }
  }, [activeQuery])

  return (
    <div>
      <div className={styles.editorContainer}>
        {/* Highlighted Query */}
        <div
          ref={highlightedDivRef}
          className={styles.highlightedQuery}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
          dangerouslySetInnerHTML={{ __html: highlightQuery(query) }}
        />

        {/* Transparent Textarea for typing */}
        <textarea
          ref={textareaRef}
          className={styles.textinput}
          placeholder="Enter your query here"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck="false"
        />
      </div>
      <select name="cars" id="cars" className={styles.select} defaultValue="Select a Table">
      <option value="Choose a Table" className={styles.option}>Choose a Table</option>
        <option value="volvo" className={styles.option}>Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
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
                table: "users",
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

        {/* <button
            type="button"
            className={`${styles.button} ${styles.copyButton}`}
            onClick={() => {
              setPinned(!pinned)
              navigator.clipboard.writeText(query)
              console.log(pinned)
              if (pinned) {
                toast.success("Query unpinned!")
              } else {
                toast.success("Query pinned!")

              }
            }}
            title="Pin Query"
          >
            {pinned ? (
              <PinOff className={styles.pinIcon} />
            ) : (
              <Pin className={styles.unpinIcon} />
            )}
          </button> */}
      </div>
    </div>
  )
}

export default QueryInput
