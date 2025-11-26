import Link from "next/link";
import styles from "./styles/Navbar.module.css";

export default function Navbar({ isAuthenticated }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <Link href="/" className={styles.navBrand} aria-label="CodeDex Home">
          <img src="/images/codedex.png" alt="CodeDex" className={styles.navLogo} />
        </Link>
        <div className={styles.navLinks}>
          {isAuthenticated ? (
            <Link href="/dashboard" className={styles.navLink + " " + styles.navPrimary}>Dashboard</Link>
          ) : (
            <>
              <Link href="/auth/login" className={styles.navLink}>Login</Link>
              <Link href="/auth/signup" className={styles.navLink + " " + styles.navPrimary}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
