import React from 'react';
import styles from './MeshLines.css'; // Include your CSS file

const MeshLines = () => {
    return (
        <div className={styles.meshlines}>
            <div className={styles.blurrotateblend}>
            </div>
            <div className={styles.conicunderblur}></div>
        </div>
    );
};

export default MeshLines;
