"use client";
import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import QueryInput from "@/components/QueryInput/QueryInput";
import Sidebar from "@/components/Sidebar/Sidebar";
import { SidebarOpen } from "lucide-react";
import { useState } from "react";

export default function Home() {
	const [sidebar, setSidebar] = useState(false);

	return (
		<div
		className={styles.container}>
			<SidebarOpen
				onClick={() => setSidebar(true)}
				className={`${styles.sidebarIcon} ${sidebar ? styles.enabled : ""}`}
			/>
			<Sidebar sidebar={sidebar} setSidebar={setSidebar} />
			<div className={styles.contentContainer}>
				<Header />
				<QueryInput />
			</div>
		</div>
	);
}
