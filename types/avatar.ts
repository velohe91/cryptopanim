/**
 * Avatar model for the dressing room.
 *
 * Paint order is NOT the category order. Every sprite declares its own `z`
 * using the bands in `LAYER_Z`. A single item (hair, hoodie) may register
 * more than one layer.
 *
 * To add a wearable: export a full-frame PNG (see `AVATAR_FRAME`) into
 * `/public/assets/<category>/` and append an `AvatarItem` in
 * `lib/avatar/catalog.ts`. Do not special-case the new id in the renderer.
 */

/** Categories visible in the dressing-room inventory. */
export const AVATAR_CATEGORIES = [
  "base",
  "eyes",
  "hair",
  "top",
  "bottom",
  "accessory",
  "background",
] as const;

/**
 * Internal categories still include "skin": its sprite remains a render layer,
 * but users now choose skin tone through the single visible "Skin" (base) tab.
 */
export type AvatarCategory =
  | (typeof AVATAR_CATEGORIES)[number]
  | "skin";

/** One equipped item per accessory slot. */
export const ACCESSORY_SLOTS = ["head", "neck", "hands"] as const;

export type AccessorySlot = (typeof ACCESSORY_SLOTS)[number];

/**
 * Intrinsic size of every avatar sprite, in pixels.
 * Keep this in sync with `scripts/generate-placeholder-sprites.mjs`
 * and `scripts/verify-assets.mjs`.
 * Every layer is this full square so the stack shares one origin.
 */
export const AVATAR_FRAME = {
  width: 990,
  height: 990,
} as const;

/**
 * Paint-order bands. Leave gaps so a new part can sit between existing
 * layers without renumbering the catalog.
 *
 * background → hair back → skin → body outline → bottom → top →
 * neck → eyes → hair front → hood → head → hands
 */
export const LAYER_Z = {
  background: 0,
  hairBack: 10,
  skin: 20,
  base: 30,
  bottom: 40,
  top: 50,
  neck: 60,
  eyes: 70,
  hairFront: 80,
  hood: 85,
  head: 90,
  hands: 100,
} as const;

export type LayerZ = (typeof LAYER_Z)[keyof typeof LAYER_Z];

export interface SpriteLayer {
  /** Public path, e.g. "/assets/hair/bob-front.png". */
  src: string;
  /** Paint order. Higher draws in front. Use a `LAYER_Z` band. */
  z: number;
  /**
   * Optional nudge in source pixels (the `AVATAR_FRAME` grid).
   * Placeholder art is full-frame and leaves these at 0.
   * Use them only when a future sprite is not aligned to the frame.
   */
  offsetX?: number;
  offsetY?: number;
}

export interface AvatarItem {
  id: string;
  name: string;
  category: AvatarCategory;
  /** Required when `category` is "accessory". Ignored otherwise. */
  slot?: AccessorySlot;
  /** One line shown in the inventory detail. */
  blurb: string;
  layers: readonly SpriteLayer[];
}

/**
 * Persisted outfit. Required slots (base/skin/eyes) are always set.
 * The visible Skin tab updates the matching base and skin layers together.
 *
 * `accessories` stores at most one item id per slot.
 */
export interface EquippedAvatar {
  baseId: string;
  skinId: string;
  eyesId: string;
  hairId: string | null;
  topId: string | null;
  bottomId: string | null;
  accessories: Partial<Record<AccessorySlot, string>>;
  backgroundId: string | null;
}

/** Categories the user cannot clear. Swap them instead. */
export const REQUIRED_CATEGORIES = ["base", "skin", "eyes"] as const satisfies readonly AvatarCategory[];

export type RequiredCategory = (typeof REQUIRED_CATEGORIES)[number];

export function isRequiredCategory(category: AvatarCategory): category is RequiredCategory {
  return (REQUIRED_CATEGORIES as readonly AvatarCategory[]).includes(category);
}
