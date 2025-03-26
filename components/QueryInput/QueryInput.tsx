"use client";
import { useState, useRef, useEffect } from "react";
import hljs from "highlight.js/lib/core";
import sql from "highlight.js/lib/languages/sql";
import "highlight.js/styles/github-dark.css";
import React from "react";
import { toast } from "sonner";
import styles from "./queryInput.module.css";
import { Copy } from "lucide-react";
hljs.registerLanguage("sql", sql);

function QueryInput() {
	const [query, setQuery] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const highlightedDivRef = useRef<HTMLDivElement>(null);

	const highlightQuery = (text: string) => {
		return hljs.highlight(text, { language: "sql" }).value;
	};

	useEffect(() => {
		const handleScroll = () => {
			if (textareaRef.current && highlightedDivRef.current) {
				highlightedDivRef.current.scrollTop = textareaRef.current.scrollTop;
				highlightedDivRef.current.scrollLeft = textareaRef.current.scrollLeft;
			}
		};

		const textarea = textareaRef.current;
		textarea?.addEventListener("scroll", handleScroll);

		return () => {
			textarea?.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div>
			<div className={styles.editorContainer}>
				{/* Highlighted Query */}
				<div
					ref={highlightedDivRef}
					className={styles.highlightedQuery}
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
			<div className={styles.buttonContainer}>
				<button
					type="button"
					className={styles.button}
					onClick={() => toast("Query executed!")}
				>
					Execute Query
				</button>
				<button type="button" className={styles.button} onClick={() => {
					setQuery("");
					toast("Query cleared!");
					textareaRef.current?.focus();
				}}>
					<span>Clear Query</span>
				</button>
				<button 
					type="button" 
					className={`${styles.button} ${styles.copyButton}`} 
					onClick={() => {
						navigator.clipboard.writeText(query);
						toast("Query copied to clipboard");
					}}
					title="Copy to clipboard"
				>
					<Copy className={styles.copyIcon} />
				</button>
			</div>
		</div>
	);
}

export default QueryInput;
