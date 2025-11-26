import styles from "./styles/FeatureCard.module.css";

export default function FeatureCard({ icon, alt, title, desc, children, className }) {
  return (
    <div className={className ? `${styles.featureCard} ${className}` : styles.featureCard}>
      {icon && (
        <div className={styles.featureIcon}>
          <img src={icon} alt={alt} className={styles.featureIconImg} />
        </div>
      )}
      {title && <h3 className={styles.featureTitle}>{title}</h3>}
      {desc && <p className={styles.featureDesc}>{desc}</p>}
      {children}
    </div>
  );
}
