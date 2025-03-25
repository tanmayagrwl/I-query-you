"use client";
import { useState } from "react";
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";
import "highlight.js/styles/github-dark.css";
import styles from "./page.module.css";

hljs.registerLanguage("sql", sql);

export default function Home() {
  const [query, setQuery] = useState("");
  const highlightQuery = (text: string) => {
    return hljs.highlight(text, { language: "sql" }).value;
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>I Query You</h1>
        <p className={styles.description}>
          Effortlessly execute and manage your queries with powerful precision
        </p>
      </div>
      <div className={styles.editorContainer}>
        {/* Fake Highlighted Query */}
        <div 
          className={styles.highlightedQuery} 
          dangerouslySetInnerHTML={{ __html: highlightQuery(query) }} 
        />
        
        {/* Transparent Textarea for typing */}
        <textarea
          className={styles.textinput}
          placeholder="Enter your query here"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
