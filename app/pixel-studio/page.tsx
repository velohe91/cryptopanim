import Link from "next/link";
import styles from "./PixelStudio.module.css";

export const metadata = {
  title: "CryptoPanim — Panim Pixel Studio",
  description: "A creative workspace for drawing pixel art and bringing Panims to life.",
};

export default function PixelStudioPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">CRYPTOPANIM <span>/ PIXEL LAB</span></Link>
        <Link className={styles.back} href="/">← Dressing Room</Link>
      </header>

      <section className={styles.hero}>
        <div className={styles.iconFrame} aria-hidden="true">
          <span>▦</span><span>✦</span><span>▧</span>
        </div>
        <p className={styles.eyebrow}>PANIM CREATIVE LAB · 001</p>
        <h1>Panim <span>Pixel Studio</span></h1>
        <p className={styles.description}>
          Every Panim begins with a pixel. This is your space to draw, experiment,
          and bring new worlds to life — one pixel at a time.
        </p>
        <div className={styles.status}><span /> STUDIO INITIALIZING</div>
      </section>

      <section className={styles.features} aria-label="Studio roadmap">
        <article className={styles.featureCard}>
          <span className={styles.featureIcon}>✎</span>
          <p className={styles.featureLabel}>01 / CREATE</p>
          <h2>Pixel drawing</h2>
          <p>A focused canvas for precise pixel-art creation.</p>
          <span className={styles.comingSoon}>IN DEVELOPMENT</span>
        </article>
        <article className={styles.featureCard}>
          <span className={styles.featureIcon}>▤</span>
          <p className={styles.featureLabel}>02 / ANIMATE</p>
          <h2>Frame by frame</h2>
          <p>Build movement with an animation timeline.</p>
          <span className={styles.comingSoon}>IN DEVELOPMENT</span>
        </article>
        <article className={styles.featureCard}>
          <span className={styles.featureIcon}>↗</span>
          <p className={styles.featureLabel}>03 / EXPORT</p>
          <h2>Your art, your files</h2>
          <p>Prepare pixel-perfect artwork for your projects.</p>
          <span className={styles.comingSoon}>PLANNED</span>
        </article>
      </section>

      <footer className={styles.footer}>MADE FOR PIXEL ARTISTS · BUILT IN THE PANIM METAVERSE</footer>
    </main>
  );
}
