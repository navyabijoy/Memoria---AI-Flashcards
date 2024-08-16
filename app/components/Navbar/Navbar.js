import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";


const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarHeader}>
        <div className={styles.logoFrame}>
          <div className={styles.logo}></div>
          <p className={styles.logoText}>Memoria</p>
        </div>
        <div className={styles.links}>
            <a className={styles.navLink} href="/pricing">Pricing</a>
          
            <a className={styles.navLink} href="/contact">Contact</a>
        </div>
        <SignedOut>
        <a className={styles.navLink} href="/sign-in">Login</a>
        <button className={styles.iconButton} href="/sign-up">Sign Up</button>
        </SignedOut>
        <SignedIn>
            <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
