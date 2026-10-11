import { getItem } from "@/lib/avatar/catalog";
import {
  ACCESSORY_SLOTS,
  isRequiredCategory,
  type AvatarItem,
  type EquippedAvatar,
} from "@/types/avatar";

/** First-visit outfit. Also the target of Reset. */
export const DEFAULT_EQUIPPED: EquippedAvatar = {
  baseId: "medium",
  skinId: "skin-medium",
  eyesId: "expressive",
  hairId: "high-bun",
  topId: "casual-shirt",
  bottomId: "shorts",
  accessories: { head: "cap" },
  backgroundId: "based-blue",
};

export function cloneEquipped(equipped: EquippedAvatar): EquippedAvatar {
  return {
    ...equipped,
    accessories: { ...equipped.accessories },
  };
}

export function cloneDefault(): EquippedAvatar {
  return cloneEquipped(DEFAULT_EQUIPPED);
}

function idForCategory(value: unknown, category: AvatarItem["category"]): string | null {
  if (typeof value !== "string") return null;
  const item = getItem(value);
  if (!item || item.category !== category) return null;
  return item.id;
}

/**
 * Drops unknown ids (a sprite removed from the catalog) back to a safe outfit.
 * Called when reading localStorage so an old save cannot point at a missing file.
 */
export function sanitizeEquipped(input: unknown): EquippedAvatar {
  const fallback = cloneDefault();
  if (!input || typeof input !== "object") return fallback;

  const raw = input as Record<string, unknown>;
  const required = (value: unknown, category: "base" | "skin" | "eyes", fallbackId: string) =>
    idForCategory(value, category) ?? fallbackId;

  const accessories: EquippedAvatar["accessories"] = {};
  if (raw.accessories && typeof raw.accessories === "object") {
    const rawSlots = raw.accessories as Record<string, unknown>;
    for (const slot of ACCESSORY_SLOTS) {
      const id = idForCategory(rawSlots[slot], "accessory");
      const item = id ? getItem(id) : undefined;
      if (item?.slot === slot) accessories[slot] = item.id;
    }
  }

  return {
    baseId: required(raw.baseId, "base", fallback.baseId),
    skinId: required(raw.skinId, "skin", fallback.skinId),
    eyesId: required(raw.eyesId, "eyes", fallback.eyesId),
    hairId: idForCategory(raw.hairId, "hair"),
    topId: idForCategory(raw.topId, "top"),
    bottomId: idForCategory(raw.bottomId, "bottom"),
    backgroundId: idForCategory(raw.backgroundId, "background"),
    accessories,
  };
}

export function serializeEquipped(equipped: EquippedAvatar): string {
  return JSON.stringify({
    baseId: equipped.baseId,
    skinId: equipped.skinId,
    eyesId: equipped.eyesId,
    hairId: equipped.hairId,
    topId: equipped.topId,
    bottomId: equipped.bottomId,
    backgroundId: equipped.backgroundId,
    accessories: {
      head: equipped.accessories.head ?? null,
      neck: equipped.accessories.neck ?? null,
      hands: equipped.accessories.hands ?? null,
    },
  });
}

export function sameEquipped(a: EquippedAvatar, b: EquippedAvatar): boolean {
  return serializeEquipped(a) === serializeEquipped(b);
}

export function isEquipped(equipped: EquippedAvatar, item: AvatarItem): boolean {
  switch (item.category) {
    case "base":
      return equipped.baseId === item.id;
    case "skin":
      return equipped.skinId === item.id;
    case "eyes":
      return equipped.eyesId === item.id;
    case "hair":
      return equipped.hairId === item.id;
    case "top":
      return equipped.topId === item.id;
    case "bottom":
      return equipped.bottomId === item.id;
    case "background":
      return equipped.backgroundId === item.id;
    case "accessory":
      return item.slot ? equipped.accessories[item.slot] === item.id : false;
    default: {
      const _never: never = item.category;
      return _never;
    }
  }
}

export function equipItem(equipped: EquippedAvatar, item: AvatarItem): EquippedAvatar {
  switch (item.category) {
    case "base": {
      // The single visible Skin tab selects the body outline and matching
      // skin-fill layer together, avoiding two tabs for the same tone choice.
      const matchingSkinId = item.id === "light"
        ? "skin-light"
        : item.id === "light-medium"
          ? "skin-light-medium"
          : item.id === "medium"
            ? "skin-medium"
            : item.id === "medium-deep"
              ? "skin-medium-deep"
              : item.id === "deep"
                ? "skin-deep"
                : equipped.skinId;
      return { ...equipped, baseId: item.id, skinId: matchingSkinId };
    }
    case "skin":
      return { ...equipped, skinId: item.id };
    case "eyes":
      return { ...equipped, eyesId: item.id };
    case "hair":
      return { ...equipped, hairId: item.id };
    case "top":
      return { ...equipped, topId: item.id };
    case "bottom":
      return { ...equipped, bottomId: item.id };
    case "background":
      return { ...equipped, backgroundId: item.id };
    case "accessory": {
      if (!item.slot) return equipped;
      return {
        ...equipped,
        accessories: { ...equipped.accessories, [item.slot]: item.id },
      };
    }
    default: {
      const _never: never = item.category;
      return _never;
    }
  }
}

export function unequipItem(equipped: EquippedAvatar, item: AvatarItem): EquippedAvatar {
  if (isRequiredCategory(item.category)) return equipped;
  if (!isEquipped(equipped, item)) return equipped;

  switch (item.category) {
    case "hair":
      return { ...equipped, hairId: null };
    case "top":
      return { ...equipped, topId: null };
    case "bottom":
      return { ...equipped, bottomId: null };
    case "background":
      return { ...equipped, backgroundId: null };
    case "accessory": {
      if (!item.slot) return equipped;
      const accessories = { ...equipped.accessories };
      delete accessories[item.slot];
      return { ...equipped, accessories };
    }
    default:
      return equipped;
  }
}

/**
 * Get Naked keeps the body identity (base, skin, eyes) and clears clothes,
 * hair, accessories, and background. A bare outline without skin or eyes
 * is not a usable avatar, so those required slots stay.
 */
export function nakedFrom(equipped: EquippedAvatar): EquippedAvatar {
  return {
    baseId: equipped.baseId,
    skinId: equipped.skinId,
    eyesId: equipped.eyesId,
    hairId: null,
    topId: null,
    bottomId: null,
    accessories: {},
    backgroundId: null,
  };
}

export function isNaked(equipped: EquippedAvatar): boolean {
  return sameEquipped(equipped, nakedFrom(equipped));
}

export function isDefaultOutfit(equipped: EquippedAvatar): boolean {
  return sameEquipped(equipped, DEFAULT_EQUIPPED);
}

export interface EquippedEntry {
  label: string;
  name: string;
}

export function equippedEntries(equipped: EquippedAvatar): EquippedEntry[] {
  const rows: Array<[string, string | null | undefined]> = [
    ["Base", equipped.baseId],
    ["Piel", equipped.skinId],
    ["Ojos", equipped.eyesId],
    ["Cabello", equipped.hairId],
    ["Superior", equipped.topId],
    ["Inferior", equipped.bottomId],
    ["Cabeza", equipped.accessories.head],
    ["Cuello", equipped.accessories.neck],
    ["Manos", equipped.accessories.hands],
    ["Fondo", equipped.backgroundId],
  ];

  return rows.flatMap(([label, id]) => {
    if (!id) return [];
    const item = getItem(id);
    return item ? [{ label, name: item.name }] : [];
  });
}

export function describeAvatar(equipped: EquippedAvatar): string {
  const names = equippedEntries(equipped).map((entry) => `${entry.label}: ${entry.name}`);
  return names.join(", ");
}
