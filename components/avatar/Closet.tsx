"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { equippedEntries } from "@/lib/avatar/equipped";
import { deleteSavedOutfit, listSavedOutfits, renameSavedOutfit, type SavedOutfit } from "@/lib/avatar/closet-storage";
import { exportOutfitPng } from "@/lib/avatar/export-outfit";
import { useAvatar } from "./AvatarProvider";
import { AvatarRenderer } from "./AvatarRenderer";
import styles from "./Closet.module.css";

export function Closet() {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [selected, setSelected] = useState<SavedOutfit | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const { loadOutfit } = useAvatar();
  const router = useRouter();

  const refresh = useCallback(() => setOutfits(listSavedOutfits()), []);

  useEffect(() => {
    refresh();
    const update = () => refresh();
    window.addEventListener("cryptopanim:closet-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cryptopanim:closet-updated", update);
      window.removeEventListener("storage", update);
    };
  }, [refresh]);

  function rename(outfit: SavedOutfit) {
    const nextName = window.prompt("Rename this outfit", outfit.name);
    if (nextName === null) return;
    if (!nextName.trim()) { setError("Outfit name cannot be empty."); return; }
    try {
      renameSavedOutfit(outfit.id, nextName);
      setSelected((current) => current?.id === outfit.id ? { ...current, name: nextName.trim() } : current);
      setError("");
      refresh();
    } catch {
      setError("Could not rename this outfit.");
    }
  }

  function remove(outfit: SavedOutfit) {
    if (!window.confirm(`Delete "${outfit.name}" from My Closet? This cannot be undone.`)) return;
    deleteSavedOutfit(outfit.id);
    setSelected((current) => current?.id === outfit.id ? null : current);
    refresh();
  }

  async function download(outfit: SavedOutfit) {
    setBusyId(outfit.id);
    setError("");
    try { await exportOutfitPng(outfit.equipped, outfit.name, 2048); }
    catch { setError("The image could not be exported. Please try again."); }
    finally { setBusyId(null); }
  }

  function edit(outfit: SavedOutfit) {
    loadOutfit(outfit.equipped);
    router.push("/");
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>CRYPTOPANIM / AVATAR SYSTEM</p>
          <h1>My Closet</h1>
          <p className={styles.subtitle}>Your looks, saved for the next adventure.</p>
        </div>
        <Link className={styles.back} href="/">← Dressing Room</Link>
      </header>

      {error && <p className={styles.error} role="alert">{error}</p>}
      {outfits.length === 0 ? (
        <section className={styles.empty}>
          <span aria-hidden="true">✦</span>
          <h2>Your closet is waiting</h2>
          <p>Design a Panim look and save it to keep it here.</p>
          <Link className={styles.primary} href="/">Go to Dressing Room</Link>
        </section>
      ) : (
        <section className={styles.grid} aria-label="Saved outfits">
          {outfits.map((outfit) => (
            <article className={styles.card} key={outfit.id}>
              <button className={styles.preview} type="button" onClick={() => setSelected(outfit)} aria-label={`View ${outfit.name} details`}>
                <AvatarRenderer equipped={outfit.equipped} />
                <span className={styles.viewLabel}>View outfit details ↗</span>
              </button>
              <div className={styles.cardBody}>
                <h2 title={outfit.name}>{outfit.name}</h2>
                <div className={styles.cardActions}>
                  <button className={styles.download} type="button" disabled={busyId === outfit.id} onClick={() => void download(outfit)}>{busyId === outfit.id ? "Preparing…" : "↓ Download"}</button>
                  <button type="button" onClick={() => edit(outfit)}>Edit</button>
                  <button type="button" aria-label={`Rename ${outfit.name}`} onClick={() => rename(outfit)}>Rename</button>
                  <button type="button" aria-label={`Delete ${outfit.name}`} onClick={() => remove(outfit)}>Delete</button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {selected && (
        <div className={styles.backdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <section className={styles.detailModal} role="dialog" aria-modal="true" aria-labelledby="outfit-detail-title">
            <button className={styles.close} type="button" aria-label="Close details" onClick={() => setSelected(null)}>×</button>
            <p className={styles.kicker}>SAVED OUTFIT</p>
            <h2 id="outfit-detail-title">{selected.name}</h2>
            <div className={styles.detailLayout}>
              <div className={styles.detailPreview}><AvatarRenderer equipped={selected.equipped} /></div>
              <div className={styles.details}>
                <h3>Equipped items</h3>
                <ul>{equippedEntries(selected.equipped).map((entry) => <li key={entry.label}><span>{entry.label}</span><strong>{entry.name}</strong></li>)}</ul>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.primary} type="button" disabled={busyId === selected.id} onClick={() => void download(selected)}>{busyId === selected.id ? "Preparing image…" : "↓ Download PNG · 2048 × 2048"}</button>
              <button type="button" onClick={() => edit(selected)}>Load to Dressing Room</button>
              <button type="button" onClick={() => setSelected(null)}>Close</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
