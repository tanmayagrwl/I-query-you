import React from "react";
import styles from "./sidebar.module.css";
import { SidebarClose } from "lucide-react";

interface SidebarProps {
    sidebar: boolean;
    setSidebar: (value: boolean) => void;
}

function Sidebar({ sidebar, setSidebar }: SidebarProps) {
    return (
        <div className={`${styles.queryHistory} ${sidebar ? styles.enabled : ""}`}>
            <div className={styles.header}>
                <SidebarClose onClick={() => setSidebar(false)} />
                <h1 className={styles.sidebarTitle}>Query History</h1>
            </div>
            <div>
                <div className={styles.queryHeader}>
                    <h3>Query 1</h3>
                    <div className={styles.queryActions}>
                        <button type="button" className={styles.sidebarActionButton}>Copy</button>
                        <button type="button">Pin</button>
                    </div>
                </div>
                <div className={styles.queryContent}>
                    <p>SELECT * FROM users</p>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;