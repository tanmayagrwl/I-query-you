import React from "react";
import styles from "./header.module.css";
function Header() {
	return (
		<div>
			<div className={styles.header}>
				<h1 className={styles.title}>I Query You</h1>
				<p className={styles.description}>
					Effortlessly execute and manage your queries with powerful precision
				</p>
			</div>
		</div>
	);
}

export default Header;
