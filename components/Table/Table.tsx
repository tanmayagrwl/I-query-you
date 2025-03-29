import React from 'react'
import styles from './table.module.css'
import { useStore } from '@/store/useStore'
function Table() {
    const { tables, selectedTable } = useStore()
  return (
    <div>
         <div className={styles.csvJsonSection}>
        {selectedTable && tables[selectedTable] && tables[selectedTable].length > 0 && (
         <div className={styles.csvTableWrapper}>
         <div className={styles.csvTableContainer}>
           <table className={styles.csvTable}>
             <thead>
               <tr>
                 {Object.keys(tables[selectedTable][0] as Record<string, any>).map((header, index) => (
                   <th key={index}>{header}</th>
                 ))}
               </tr>
             </thead>
             <tbody>
               {tables[selectedTable].map((row: any, rowIndex) => (
                 <tr key={rowIndex}>
                   {Object.values(row).map((cell: any, cellIndex) => (
                     <td key={cellIndex}>{cell}</td>
                   ))}
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
        )}
      </div>


    </div>
  )
}

export default Table