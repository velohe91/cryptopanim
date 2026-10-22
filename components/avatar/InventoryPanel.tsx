"use client";

import { useState } from "react";
import { getItem, itemsInCategory } from "@/lib/avatar/catalog";
import { isEquipped } from "@/lib/avatar/equipped";
import { CATEGORY_LABELS, SLOT_LABELS } from "@/lib/avatar/labels";
import {
  AVATAR_CATEGORIES,
  AVATAR_FRAME,
  type AccessorySlot,
  type AvatarCategory,
  type AvatarItem,
} from "@/types/avatar";
import { useAvatar } from "./AvatarProvider";
import { EquipControls } from "./ActionBar";
import styles from "./InventoryPanel.module.css";

interface InventoryPanelProps {
  category: AvatarCategory;
  accessorySlot: AccessorySlot | "all";
  selectedId: string | null;
  onCategory: (category: AvatarCategory) => void;
  onAccessorySlot: (slot: AccessorySlot | "all") => void;
  onSelect: (itemId: string) => void;
}

export function InventoryPanel({
  category,
  selectedId,
  onCategory,
  onSelect,
}: InventoryPanelProps) {
  const { equipped } = useAvatar();
  const [hairStyle, setHairStyle] = useState("high-bun");
  const [topStyle, setTopStyle] = useState("casual");
  const [bottomStyle, setBottomStyle] = useState("jeans");
  const [shoeStyle, setShoeStyle] = useState("sneakers");
  const [accessoryStyle, setAccessoryStyle] = useState("all");
  const allItems = itemsInCategory(category, "all");
  const items = category === "hair"
    ? allItems.filter((item) => item.id.startsWith(`${hairStyle}-`) || (hairStyle === "high-bun" && item.id === "high-bun"))
    : category === "top"
      ? allItems.filter((item) => item.id.startsWith(`${topStyle}-`) || (topStyle === "casual" && item.id === "casual-shirt"))
      : category === "bottom"
        ? allItems.filter((item) => item.id.startsWith(`${bottomStyle}-`) || (bottomStyle === "jeans" && item.id === "pants") || (bottomStyle === "shorts" && item.id === "shorts"))
        : category === "shoes"
          ? allItems.filter((item) => item.id.startsWith(`${shoeStyle}-`) || item.id === "black-sneakers" || item.id === "blue-sneakers")
          : category === "accessory" && accessoryStyle !== "all"
            ? allItems.filter((item) => item.id.startsWith(`${accessoryStyle}-`))
            : allItems;
  const selected = selectedId ? getItem(selectedId) : undefined;

  return (
    <section className={styles.panel} aria-label="Inventory">
      <div className={styles.tabs} role="tablist" aria-label="Categories">
        {AVATAR_CATEGORIES.map((entry) => {
          const active = entry === category;
          return (
            <button
              key={entry}
              type="button"
              role="tab"
              aria-selected={active}
              className={active ? styles.tabActive : styles.tab}
              onClick={() => onCategory(entry)}
            >
              {CATEGORY_LABELS[entry]}
            </button>
          );
        })}
      </div>

      {category === "hair" ? (
        <div className={styles.subtabs} role="tablist" aria-label="Hair style">
          {[
            ["high-bun", "High Bun"],
            ["long-layered", "Long Layered"],
            ["long-wave", "Long Wave"],
            ["short-bob", "Short Bob"],
            ["side-sweep", "Side Sweep"],
          ].map(([id, label]) => (
            <SlotButton
              key={id}
              label={label}
              active={hairStyle === id}
              onClick={() => setHairStyle(id)}
            />
          ))}
        </div>
      ) : null}

      {category === "top" ? (
        <div className={styles.subtabs} role="tablist" aria-label="Top style">
          {[
            ["casual", "Casual"],
            ["shirt", "Shirt"],
            ["sweater", "Sweater"],
            ["tshirt", "T-Shirt"],
          ].map(([id, label]) => (
            <SlotButton
              key={id}
              label={label}
              active={topStyle === id}
              onClick={() => setTopStyle(id)}
            />
          ))}
        </div>
      ) : null}

      {category === "bottom" ? (
        <div className={styles.subtabs} role="tablist" aria-label="Bottom style">
          {[
            ["jeans", "Jeans"],
            ["pants", "Pants"],
            ["shorts", "Shorts"],
            ["skirt", "Skirt"],
          ].map(([id, label]) => (
            <SlotButton
              key={id}
              label={label}
              active={bottomStyle === id}
              onClick={() => setBottomStyle(id)}
            />
          ))}
        </div>
      ) : null}

      {category === "shoes" ? (
        <div className={styles.subtabs} role="tablist" aria-label="Shoes style">
          {[
            ["sneakers", "Sneakers"],
          ].map(([id, label]) => (
            <SlotButton
              key={id}
              label={label}
              active={shoeStyle === id}
              onClick={() => setShoeStyle(id)}
            />
          ))}
        </div>
      ) : null}

      {category === "accessory" ? (
        <>
          <div className={styles.subtabs} role="tablist" aria-label="Accessory category">
            {[
              ["all", "All"],
              ["dj-deck", "DJ Deck"],
              ["geek-classes", "Geek Classes"],
              ["sun-glasses", "Sun Glasses"],
              ["ballons", "Ballons"],
              ["cakes", "Cakes"],
              ["headphones", "Headphones"],
              ["party-hats", "Party Hats"],
            ].map(([id, label]) => (
              <SlotButton
                key={id}
                label={label}
                active={accessoryStyle === id}
                onClick={() => setAccessoryStyle(id)}
              />
            ))}
          </div>
        </>
      ) : null}

      <ul className={styles.grid}>
        {items.map((item) => {
          const on = isEquipped(equipped, item);
          const active = item.id === selectedId;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={active ? styles.cardActive : styles.card}
                aria-pressed={on}
                onClick={() => onSelect(item.id)}
              >
                <ItemThumb item={item} />
                <span className={styles.cardName}>{item.name}</span>
                {on ? <span className={styles.badge}>Equipped</span> : null}
              </button>
            </li>
          );
        })}
      </ul>

      <footer className={styles.detail}>
        {selected ? (
          <>
            <h2>{selected.name}</h2>
            <p className={styles.meta}>
              {CATEGORY_LABELS[selected.category]}
              {selected.slot ? ` · ${SLOT_LABELS[selected.slot]}` : ""}
              {isEquipped(equipped, selected) ? " · equipped" : ""}
            </p>
            <p>{selected.blurb}</p>
          </>
        ) : (
          <p>Choose an item from the inventory.</p>
        )}
      </footer>

      <EquipControls selectedId={selectedId} />
    </section>
  );
}

function SlotButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={active ? styles.subtabActive : styles.subtab}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function ItemThumb({ item }: { item: AvatarItem }) {
  const layers = thumbLayers(item);
  return (
    <span className={styles.thumb}>
      {layers.map((layer) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${item.id}:${layer.src}`}
          src={layer.src}
          alt=""
          width={AVATAR_FRAME.width}
          height={AVATAR_FRAME.height}
          draggable={false}
          style={{ zIndex: layer.z }}
        />
      ))}
    </span>
  );
}

/**
 * Shows the item on the Medium body so a hair-front PNG is not an empty
 * thumbnail. Base, skin, and background thumbs show only their own layers.
 */
function thumbLayers(item: AvatarItem): Array<{ src: string; z: number }> {
  if (item.category === "background" || item.category === "base" || item.category === "skin") {
    return item.layers.map((layer) => ({ src: layer.src, z: layer.z }));
  }

  const layers: Array<{ src: string; z: number }> = [];
  const pushItem = (id: string) => {
    const under = getItem(id);
    if (!under) return;
    for (const layer of under.layers) {
      layers.push({ src: layer.src, z: layer.z });
    }
  };

  pushItem("medium");
  if (item.category !== "eyes") pushItem("expressive");
  for (const layer of item.layers) {
    layers.push({ src: layer.src, z: layer.z });
  }
  return layers;
}
