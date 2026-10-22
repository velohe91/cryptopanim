import {
  LAYER_Z,
  type AccessorySlot,
  type AvatarCategory,
  type AvatarItem,
} from "@/types/avatar";

/**
 * Source of truth for wearables in the MVP.
 *
 * Every catalog entry is treated as owned. When wallet / NFT inventory
 * arrives, filter this list in `listOwnedItems()` — do not fork the renderer.
 *
 * Sprite paths are full-frame 990×990 PNGs (`AVATAR_FRAME`). Replace the file
 * and keep the same `src`, or add a new item. Multi-part clothes (hair back +
 * front, hoodie shell + hood) are just extra `layers` with their own `z`.
 *
 * Every PNG already on disk is a full 990×990 frame. Layers share the top-left
 * of that canvas (`public/assets/_guide/body-guide.png`). Paths below match
 * the exported filenames, including spaces.
 */
const HAIR_STYLES = [
  {
    id: "high-bun",
    name: "High Bun",
    folder: "high bun",
    colors: ["Aqua Pop", "Birthday Pink", "Brown", "Candy Rainbow", "Cherry Red", "Chocolate Party", "Cotton Candy", "Cyan", "Electric Blue", "Golden Party", "Lavender Disco", "Lime Confetti", "Mint Pop", "Neon Purple", "Orange Soda"],
  },
  {
    id: "long-layered",
    name: "Long Layered",
    folder: "long layered",
    colors: ["Aqua Pop", "Birthday Pink", "Candy Rainbow ", "Cherry Red", "Chocolate Party", "Cotton Candy", "Cyan", "Electric Blue", "Golden Party", "Lavender Disco", "Lime Confetti", "Mint Pop", "Neon Purple", "Orange Soda", "Pink", "Purple"],
  },
  {
    id: "long-wave",
    name: "Long Wave",
    folder: "long wave",
    colors: ["Aqua Pop", "Birthday Pink", "Candy Rainbow", "Cherry Red", "Chocolate Party", "Cotton Candy", "Cyan", "Electric Blue", "Golden Party", "Lavender Disco", "Lime Confetti", "Mint Pop", "Navy", "Neon Purple", "Orange Soda", "Purple"],
  },
  {
    id: "short-bob",
    name: "Short Bob",
    folder: "short bob",
    colors: ["Aqua Pop", "Birthday Pink", "Candy Rainbow", "Cherry Red", "Chocolate Party", "Cotton Candy", "Cyan", "Electric Blue", "Golden Party", "Lavender Disco", "Lime Confetti", "Mint Pop", "Neon Purple", "Orange Soda", "Red"],
  },
  {
    id: "side-sweep",
    name: "Side Sweep",
    folder: "side sweep",
    colors: ["Aqua Pop", "Birthday Pink", "Blonde", "Candy Rainbow", "Cherry Red", "Chocolate Party", "Cotton Candy", "Cyan", "Electric Blue", "Golden Party", "Lavender Disco", "Lime Confetti", "Mint Pop", "Neon Purple", "Orange Soda"],
  },
] as const;

const HAIR_ITEMS: AvatarItem[] = HAIR_STYLES.flatMap((style) =>
  style.colors.map((color) => ({
    id: style.id === "high-bun" && color === "Brown"
      ? "high-bun"
      : `${style.id}-${color.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`,
    name: `${style.name} · ${color.trim()}`,
    category: "hair" as const,
    blurb: `${color.trim()} ${style.name.toLowerCase()} hairstyle.`,
    layers: [{
      src: `/assets/hair/${style.folder}/${color}.png`,
      z: LAYER_Z.hairFront,
    }],
  })),
);

const SHOE_STYLES = [
  {
    id: "sneakers",
    name: "Sneakers",
    folder: "Sneakers",
    colors: ["Based", "Black", "Blue", "Ocean", "Orange", "Sunny"],
  },
] as const;

const SHOE_ITEMS: AvatarItem[] = SHOE_STYLES.flatMap((style) =>
  style.colors.map((color) => ({
    id: color === "Black"
      ? "black-sneakers"
      : color === "Blue"
        ? "blue-sneakers"
        : `${style.id}-${color.toLowerCase()}`,
    name: `${style.name} · ${color}`,
    category: "shoes" as const,
    blurb: `${color} ${style.name.toLowerCase()}.`,
    layers: [{
      src: `/assets/shoes/${style.folder}/${color}.png`,
      z: LAYER_Z.shoes,
    }],
  })),
);

const BOTTOM_STYLES = [
  {
    id: "jeans",
    name: "Jeans",
    folder: "Jeans",
    colors: ["Black Denim", "Classic Blue", "Dark Denim", "Light Wash", "Vintage Brown"],
  },
  {
    id: "pants",
    name: "Pants",
    folder: "Pants",
    colors: ["Black Denim", "Classic Blue", "Dark Denim", "Light Wash", "Vintage Brown"],
  },
  {
    id: "shorts",
    name: "Shorts",
    folder: "Shorts",
    colors: ["Black Denim", "Classic Blue", "Dark Denim", "Light Wash", "Vintage Brown"],
  },
  {
    id: "skirt",
    name: "Skirt",
    folder: "Skirt",
    colors: ["Black Denim", "Classic Blue", "Dark Denim", "Light Wash", "Vintage Brown"],
  },
] as const;

const BOTTOM_ITEMS: AvatarItem[] = [
  ...BOTTOM_STYLES.flatMap((style) =>
    style.colors.map((color) => ({
      id: style.id === "jeans" && color === "Classic Blue"
        ? "pants"
        : `${style.id}-${color.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`,
      name: `${style.name} · ${color}`,
      category: "bottom" as const,
      blurb: `${color} ${style.name.toLowerCase()} bottoms.`,
      layers: [{
        src: `/assets/bottom/${style.folder}/${color}.png`,
        z: LAYER_Z.bottom,
      }],
    })),
  ),
  {
    id: "shorts",
    name: "Shorts",
    category: "bottom" as const,
    blurb: "Classic shorts.",
    layers: [{ src: "/assets/bottom/Shorts/shorts.png", z: LAYER_Z.bottom }],
  },
];

const TOP_STYLES = [
  {
    id: "casual",
    name: "Casual",
    folder: "casual",
    colors: ["Candy Pink", "Electric Blue", "Grape Soda", "Lemon Pop", "Neon Lime", "Sunset Party"],
  },
  {
    id: "shirt",
    name: "Shirt",
    folder: "shirt",
    colors: ["Based Shirt", "Candy Pink", "Electric Blue", "Grape Soda", "Lemon Pop", "Neon Lime", "Sunset Party"],
  },
  {
    id: "sweater",
    name: "Sweater",
    folder: "sweater",
    colors: ["Based Sweater", "Candy Pink", "Cyan", "Electric Blue", "Lemon Pop", "Neon Lime", "Sunset Party"],
  },
  {
    id: "tshirt",
    name: "T-Shirt",
    folder: "tshirt",
    colors: ["Based T-Shirt", "Candy Pink", "Electric Blue", "Grape Soda", "Lemon Pop", "Neon Lime", "Sunset Party"],
  },
] as const;

const TOP_ITEMS: AvatarItem[] = TOP_STYLES.flatMap((style) =>
  style.colors.map((color) => ({
    id: style.id === "casual" && color === "Electric Blue"
      ? "casual-shirt"
      : `${style.id}-${color.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")}`,
    name: `${style.name} · ${color}`,
    category: "top" as const,
    blurb: `${color} ${style.name.toLowerCase()} top.`,
    layers: [{
      src: `/assets/top/${style.folder}/${color}.png`,
      z: LAYER_Z.top,
    }],
  })),
);

export const AVATAR_CATALOG: readonly AvatarItem[] = [
  {
    id: "light",
    name: "Light",
    category: "base",
    blurb: "Light skin.",
    layers: [{ src: "/assets/base/Light/Light.png", z: LAYER_Z.base }],
  },
  {
    id: "light-hand-up",
    name: "Light · Hand-up",
    category: "base",
    blurb: "Light skin with hand-up pose.",
    layers: [{ src: "/assets/base/Light/Light Hand-up.png", z: LAYER_Z.base }],
  },
  {
    id: "light-hand-down",
    name: "Light · Hand-down",
    category: "base",
    blurb: "Light skin with hand-down pose.",
    layers: [{ src: "/assets/base/Light/Light Hand-down.png", z: LAYER_Z.base }],
  },
  {
    id: "light-medium",
    name: "Light-Medium",
    category: "base",
    blurb: "Light-Medium skin.",
    layers: [{ src: "/assets/base/Light-Medium/Light-Medium.png", z: LAYER_Z.base }],
  },
  {
    id: "light-medium-hand-up",
    name: "Light-Medium · Hand-up",
    category: "base",
    blurb: "Light-Medium skin with hand-up pose.",
    layers: [{ src: "/assets/base/Light-Medium/Light-Medium Hand-up.png", z: LAYER_Z.base }],
  },
  {
    id: "light-medium-hand-down",
    name: "Light-Medium · Hand-down",
    category: "base",
    blurb: "Light-Medium skin with hand-down pose.",
    layers: [{ src: "/assets/base/Light-Medium/Light-Medium Hand-down.png", z: LAYER_Z.base }],
  },
  {
    id: "medium",
    name: "Medium",
    category: "base",
    blurb: "Medium skin.",
    layers: [{ src: "/assets/base/Medium/Medium.png", z: LAYER_Z.base }],
  },
  {
    id: "medium-hand-up",
    name: "Medium · Hand-up",
    category: "base",
    blurb: "Medium skin with hand-up pose.",
    layers: [{ src: "/assets/base/Medium/Medium Hand-up.png", z: LAYER_Z.base }],
  },
  {
    id: "medium-hand-down",
    name: "Medium · Hand-down",
    category: "base",
    blurb: "Medium skin with hand-down pose.",
    layers: [{ src: "/assets/base/Medium/Medium Hand-down.png", z: LAYER_Z.base }],
  },
  {
    id: "medium-deep",
    name: "Medium-Deep",
    category: "base",
    blurb: "Medium-Deep skin.",
    layers: [{ src: "/assets/base/Deep-Medium/Deep-Medium.png", z: LAYER_Z.base }],
  },
  {
    id: "medium-deep-hand-up",
    name: "Medium-Deep · Hand-up",
    category: "base",
    blurb: "Medium-Deep skin with hand-up pose.",
    layers: [{ src: "/assets/base/Deep-Medium/Deep-Medium Hand-up.png", z: LAYER_Z.base }],
  },
  {
    id: "medium-deep-hand-down",
    name: "Medium-Deep · Hand-down",
    category: "base",
    blurb: "Medium-Deep skin with hand-down pose.",
    layers: [{ src: "/assets/base/Deep-Medium/Deep-Medium Hand-down.png", z: LAYER_Z.base }],
  },
  {
    id: "deep",
    name: "Deep",
    category: "base",
    blurb: "Deep skin.",
    layers: [{ src: "/assets/base/Deep/Deep.png", z: LAYER_Z.base }],
  },
  {
    id: "deep-hand-up",
    name: "Deep · Hand-up",
    category: "base",
    blurb: "Deep skin with hand-up pose.",
    layers: [{ src: "/assets/base/Deep/Deep Hand-up.png", z: LAYER_Z.base }],
  },
  {
    id: "deep-hand-down",
    name: "Deep · Hand-down",
    category: "base",
    blurb: "Deep skin with hand-down pose.",
    layers: [{ src: "/assets/base/Deep/Deep Hand-down.png", z: LAYER_Z.base }],
  },
  {
    id: "skin-light",
    name: "Light",
    category: "skin",
    blurb: "Light skin, behind the base.",
    layers: [{ src: "/assets/skin/light.png", z: LAYER_Z.skin }],
  },
  {
    id: "skin-light-medium",
    name: "Light-Medium",
    category: "skin",
    blurb: "Light-medium skin, behind the base.",
    layers: [{ src: "/assets/skin/light-medium.png", z: LAYER_Z.skin }],
  },
  {
    id: "skin-medium",
    name: "Medium",
    category: "skin",
    blurb: "Medium skin, behind the base.",
    layers: [{ src: "/assets/skin/medium.png", z: LAYER_Z.skin }],
  },
  {
    id: "skin-medium-deep",
    name: "Medium-Deep",
    category: "skin",
    blurb: "Medium-deep skin, behind the base.",
    layers: [{ src: "/assets/skin/medium-deep.png", z: LAYER_Z.skin }],
  },
  {
    id: "skin-deep",
    name: "Deep",
    category: "skin",
    blurb: "Deep skin, behind the base.",
    layers: [{ src: "/assets/skin/deep.png", z: LAYER_Z.skin }],
  },

  {
    id: "expressive",
    name: "Base Blue",
    category: "eyes",
    blurb: "Base blue eyes.",
    layers: [{ src: "/assets/eyes/Base Blue.png", z: LAYER_Z.eyes }],
  },
  {
    id: "look-left",
    name: "Black — Left",
    category: "eyes",
    blurb: "Black eyes looking left.",
    layers: [{ src: "/assets/eyes/Black-Left.png", z: LAYER_Z.eyes }],
  },
  {
    id: "look-right",
    name: "Black — Right",
    category: "eyes",
    blurb: "Black eyes looking right.",
    layers: [{ src: "/assets/eyes/Black-Right.png", z: LAYER_Z.eyes }],
  },
  {
    id: "cyber-cyan",
    name: "Cyber Cyan",
    category: "eyes",
    blurb: "Cyber cyan eyes.",
    layers: [{ src: "/assets/eyes/Cyber Cyan.png", z: LAYER_Z.eyes }],
  },
  {
    id: "deep-blue",
    name: "Deep Blue",
    category: "eyes",
    blurb: "Deep blue eyes.",
    layers: [{ src: "/assets/eyes/Deep Blue.png", z: LAYER_Z.eyes }],
  },
  {
    id: "electric-blue",
    name: "Electric Blue",
    category: "eyes",
    blurb: "Electric blue eyes.",
    layers: [{ src: "/assets/eyes/Electric Blue.png", z: LAYER_Z.eyes }],
  },
  {
    id: "pixel-blue",
    name: "Pixel Blue",
    category: "eyes",
    blurb: "Pixel blue eyes.",
    layers: [{ src: "/assets/eyes/Pixel Blue.png", z: LAYER_Z.eyes }],
  },
  ...HAIR_ITEMS,

  ...TOP_ITEMS,
  {
    id: "bitcoin-costume",
    name: "Bitcoin Costume",
    category: "costumes",
    blurb: "Bitcoin-themed outfit.",
    layers: [{ src: "/assets/costumes/bitcoin.png", z: LAYER_Z.top }],
  },
  {
    id: "pumpkin-costume",
    name: "Pumpkin Costume",
    category: "costumes",
    blurb: "Pumpkin-themed outfit.",
    layers: [{ src: "/assets/costumes/pumpkin.png", z: LAYER_Z.top }],
  },
  {
    id: "rarible-costume",
    name: "Rarible Costume",
    category: "costumes",
    blurb: "Rarible-themed outfit.",
    layers: [{ src: "/assets/costumes/rarible.png", z: LAYER_Z.top }],
  },
  {
    id: "witch-costume",
    name: "Witch Costume",
    category: "costumes",
    blurb: "Witch-themed outfit.",
    layers: [{ src: "/assets/costumes/witch.png", z: LAYER_Z.top }],
  },
  {
    id: "red-dress",
    name: "Red Dress",
    category: "dress",
    blurb: "Red dress.",
    layers: [{ src: "/assets/dress/red-dress.png", z: LAYER_Z.top }],
  },

  ...BOTTOM_ITEMS,

  ...SHOE_ITEMS,

  {
    id: "cap",
    name: "Cap",
    category: "accessory",
    slot: "head",
    blurb: "White cap with a visor.",
    layers: [{ src: "/assets/accessory/cap.png", z: LAYER_Z.head }],
  },
  {
    id: "headphones",
    name: "Headphones",
    category: "accessory",
    slot: "head",
    blurb: "Headphones with music notes.",
    layers: [{ src: "/assets/accessory/headphones.png", z: LAYER_Z.head }],
  },

  {
    id: "based-blue",
    name: "Blue",
    category: "background",
    blurb: "Blue background with a ground shadow.",
    layers: [{ src: "/assets/background/based-blue.png", z: LAYER_Z.background }],
  },
];

const BY_ID = new Map(AVATAR_CATALOG.map((item) => [item.id, item]));

export function getItem(id: string): AvatarItem | undefined {
  return BY_ID.get(id);
}

export function requireItem(id: string): AvatarItem {
  const item = BY_ID.get(id);
  if (!item) {
    throw new Error(`Unknown avatar item: ${id}`);
  }
  return item;
}

/**
 * MVP inventory: the whole catalog.
 * Replace this function when ownership comes from the wallet / NFT layer.
 */
export function listOwnedItems(): readonly AvatarItem[] {
  return AVATAR_CATALOG;
}

export function itemsInCategory(
  category: AvatarCategory,
  accessorySlot: AccessorySlot | "all" = "all",
): AvatarItem[] {
  return listOwnedItems().filter((item) => {
    if (item.category !== category) return false;
    if (category === "accessory" && accessorySlot !== "all" && item.slot !== accessorySlot) {
      return false;
    }
    return true;
  });
}
