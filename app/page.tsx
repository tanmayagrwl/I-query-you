"use client";
import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import QueryInput from "@/components/QueryInput/QueryInput";

export default function Home() {
	return (
		<div>
			<Header />
			<QueryInput />
		</div>
	);
}
