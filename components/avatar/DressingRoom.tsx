"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { itemsInCategory } from "@/lib/avatar/catalog";
import { equippedEntries, isEquipped } from "@/lib/avatar/equipped";
import type { AccessorySlot, AvatarCategory } from "@/types/avatar";
import { ActionBar } from "./ActionBar";
import { AvatarRenderer } from "./AvatarRenderer";
import { useAvatar } from "./AvatarProvider";
import { InventoryPanel } from "./InventoryPanel";
import { SaveOutfitModal } from "./SaveOutfitModal";
import styles from "./DressingRoom.module.css";

export function DressingRoom() {
  const { equipped, equip } = useAvatar();
  const [category, setCategory] = useState<AvatarCategory>("hair");
  const [accessorySlot, setAccessorySlot] = useState<AccessorySlot | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>("high-bun");
  const [saveOpen, setSaveOpen] = useState(false);
  const worn = useMemo(() => equippedEntries(equipped), [equipped]);

  function selectCategory(next: AvatarCategory) {
    setCategory(next);
    const visible = itemsInCategory(next, next === "accessory" ? accessorySlot : "all");
    const wornItem = visible.find((item) => isEquipped(equipped, item));
    setSelectedId(wornItem?.id ?? visible[0]?.id ?? null);
  }

  function selectSlot(next: AccessorySlot | "all") {
    setAccessorySlot(next);
    const visible = itemsInCategory("accessory", next);
    const wornItem = visible.find((item) => isEquipped(equipped, item));
    setSelectedId(wornItem?.id ?? visible[0]?.id ?? null);
  }

  function selectItem(itemId: string) {
    setSelectedId(itemId);
    equip(itemId);
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brandBlock}>
          <p className={styles.kicker}>Pixel avatar system</p>
          <h1>CRYPTOPANIM</h1>
          <Link className={styles.studioButton} href="/pixel-studio">
            <span aria-hidden="true">▦</span>
            <span><strong>Panim Pixel Studio</strong><small>DRAW · ANIMATE · CREATE</small></span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className={styles.room}>
          <p>Dressing Room</p>
          <Link className={styles.save} href="/closet">My Closet ↗</Link>
        </div>
      </header>
      <div className={styles.layout}>
        <section className={styles.stageColumn} aria-label="Avatar">
          <AvatarRenderer equipped={equipped} />
          <ul className={styles.chips}>
            {worn.map((entry) => <li key={entry.label}><span>{entry.label}</span>{entry.name}</li>)}
          </ul>
          <ActionBar onSave={() => setSaveOpen(true)} />
          <p className={styles.hint}>Select an item to equip it. Undo applies to this session. Get Naked keeps skin and eyes.</p>
        </section>
        <InventoryPanel category={category} accessorySlot={accessorySlot} selectedId={selectedId} onCategory={selectCategory} onAccessorySlot={selectSlot} onSelect={selectItem} />
      </div>
      {saveOpen && <SaveOutfitModal equipped={equipped} onClose={() => setSaveOpen(false)} />}
    </main>
  );
}
