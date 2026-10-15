"use client";

import { getItem } from "@/lib/avatar/catalog";
import { isDefaultOutfit, isEquipped, isNaked } from "@/lib/avatar/equipped";
import { isRequiredCategory } from "@/types/avatar";
import { useAvatar } from "./AvatarProvider";
import styles from "./ActionBar.module.css";

interface ActionBarProps {
  selectedId: string | null;
}

export function EquipControls({ selectedId }: ActionBarProps) {
  const { equipped, equip, unequip } = useAvatar();
  const selected = selectedId ? getItem(selectedId) : undefined;
  const selectedOn = selected ? isEquipped(equipped, selected) : false;
  const required = selected ? isRequiredCategory(selected.category) : false;

  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.primary}
          disabled={!selected || selectedOn}
          onClick={() => selected && equip(selected.id)}
        >
          Equip
        </button>
        <button
          type="button"
          className={styles.primary}
          disabled={!selected || !selectedOn || required}
          title={required ? "Skin and eyes can be changed, but not removed." : undefined}
          onClick={() => selected && unequip(selected.id)}
        >
          Unequip
        </button>
      </div>
    </div>
  );
}

export function ActionBar() {
  const { equipped, canUndo, reset, naked, undo } = useAvatar();

  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        <button type="button" disabled={isDefaultOutfit(equipped)} onClick={reset}>
          Reset
        </button>
        <button
          type="button"
          disabled={isNaked(equipped)}
          title="Removes hair, clothing, accessories, and background. Keeps skin and eyes."
          onClick={naked}
        >
          Get Naked
        </button>
        <button type="button" disabled={!canUndo} onClick={undo}>
          Undo
        </button>
      </div>
    </div>
  );
}
