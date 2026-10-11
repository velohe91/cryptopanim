"use client";

import { getItem, itemsInCategory } from "@/lib/avatar/catalog";
import { isEquipped } from "@/lib/avatar/equipped";
import { CATEGORY_LABELS, SLOT_LABELS } from "@/lib/avatar/labels";
import {
  ACCESSORY_SLOTS,
  AVATAR_CATEGORIES,
  AVATAR_FRAME,
  type AccessorySlot,
  type AvatarCategory,
  type AvatarItem,
} from "@/types/avatar";
import { useAvatar } from "./AvatarProvider";
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
  accessorySlot,
  selectedId,
  onCategory,
  onAccessorySlot,
  onSelect,
}: InventoryPanelProps) {
  const { equipped } = useAvatar();
  const items = itemsInCategory(category, accessorySlot);
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

      {category === "accessory" ? (
        <div className={styles.subtabs} role="tablist" aria-label="Accessory slot">
          <SlotButton
            label="All"
            active={accessorySlot === "all"}
            onClick={() => onAccessorySlot("all")}
          />
          {ACCESSORY_SLOTS.map((slot) => (
            <SlotButton
              key={slot}
              label={SLOT_LABELS[slot]}
              active={accessorySlot === slot}
              onClick={() => onAccessorySlot(slot)}
            />
          ))}
        </div>
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
              {isEquipped(equipped, selected) ? " · puesto" : ""}
            </p>
            <p>{selected.blurb}</p>
          </>
        ) : (
          <p>Choose an item from the inventory.</p>
        )}
      </footer>
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
