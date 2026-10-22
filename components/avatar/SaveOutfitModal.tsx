"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { EquippedAvatar } from "@/types/avatar";
import { saveOutfit } from "@/lib/avatar/closet-storage";
import styles from "./SaveOutfitModal.module.css";

export function SaveOutfitModal({ equipped, onClose }: { equipped: EquippedAvatar; onClose: () => void }) {
  const [name, setName] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      saveOutfit(name, equipped);
      setSaved(true);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save this outfit.");
    }
  }

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="save-outfit-title">
        <button className={styles.closeIcon} type="button" aria-label="Close dialog" onClick={onClose}>×</button>
        <p className={styles.kicker}>CRYPTOPANIM / MY CLOSET</p>
        <h2 id="save-outfit-title">{saved ? "Outfit saved!" : "Save Outfit"}</h2>
        {saved ? (
          <>
            <p className={styles.copy}>Your outfit is safely saved in My Closet on this browser.</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href="/closet">Go to My Closet</Link>
              <button type="button" onClick={onClose}>Close</button>
            </div>
          </>
        ) : (
          <form onSubmit={submit}>
            <label htmlFor="outfit-name">Outfit name</label>
            <input id="outfit-name" autoFocus maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Robin Tech" required />
            {error && <p className={styles.error} role="alert">{error}</p>}
            <div className={styles.actions}>
              <button className={styles.primary} type="submit">Save Outfit</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
