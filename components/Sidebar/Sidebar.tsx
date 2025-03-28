import React from "react"
import styles from "./sidebar.module.css"
import { Copy, Pin, PinOff, SidebarClose } from "lucide-react"
import { useStore } from "@/store/useStore"
import { toast } from "sonner"

interface SidebarProps {
  sidebar: boolean
  setSidebar: (value: boolean) => void
}

function Sidebar({ sidebar, setSidebar }: SidebarProps) {
  const { TogglePinQuery } = useStore()

  const { queries } = useStore()
  queries.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
  return (
    <div className={`${styles.queryHistory} ${sidebar ? styles.enabled : ""}`}>
      <div className={styles.header}>
        <SidebarClose onClick={() => setSidebar(false)} />
        <h1 className={styles.sidebarTitle}>Query History</h1>
      </div>
      <div className={styles.queryList}>
        {queries.map((query) => (
          <div key={query.id} className={styles.queryHeader}>
            <p className={styles.queryText}>{query.query}</p>
            <div className={styles.queryActions}>
              <button
                type="button"
                className={styles.sidebarActionButton}
                onClick={() => {
                  navigator.clipboard.writeText(query.query)
                  toast.success("Query Copied!")
                }}
              >
                <Copy className={styles.copyIcon} />
              </button>
              <button
                className={styles.sidebarActionButton}
                type="button"
                onClick={() => {
                  TogglePinQuery(query.id)
                  if (!query.pinned) {
                    toast.success("Query Pinned!")
                  } else {
                    toast.success("Query Unpinned!")
                  }
                }}
              >
                {query.pinned ? (
                  <PinOff className={styles.pinIcon} />
                ) : (
                  <Pin className={styles.unpinIcon} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
