import React from 'react';
import MeshLines from './MeshLines.css';
import Content from './Content.css';
import styles from './HeroSection.css'; // Include your CSS file

const HeroSection = () => {
    return (
        <section className={styles.herosection}>
            <MeshLines />
            <Content />
        </section>
    );
};

export default HeroSection;
