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
export const AVATAR_CATALOG: readonly AvatarItem[] = [
  {
    id: "light",
    name: "Light",
    category: "base",
    blurb: "Light body base. 990×990 PNG at public/assets/base/light.png.",
    layers: [{ src: "/assets/base/light.png", z: LAYER_Z.base }],
  },
  {
    id: "light-medium",
    name: "Light-Medium",
    category: "base",
    blurb: "Light-medium body base. 990×990 PNG at public/assets/base/light-medium.png.",
    layers: [{ src: "/assets/base/light-medium.png", z: LAYER_Z.base }],
  },
  {
    id: "medium",
    name: "Medium",
    category: "base",
    blurb: "Medium body base. 990×990 PNG at public/assets/base/medium.png.",
    layers: [{ src: "/assets/base/medium.png", z: LAYER_Z.base }],
  },
  {
    id: "medium-deep",
    name: "Medium-Deep",
    category: "base",
    blurb: "Medium-deep body base. 990×990 PNG at public/assets/base/medium-deep.png.",
    layers: [{ src: "/assets/base/medium-deep.png", z: LAYER_Z.base }],
  },
  {
    id: "deep",
    name: "Deep",
    category: "base",
    blurb: "Deep body base. 990×990 PNG at public/assets/base/deep.png.",
    layers: [{ src: "/assets/base/deep.png", z: LAYER_Z.base }],
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
    name: "Expressive",
    category: "eyes",
    blurb: "White eyes with pupils.",
    layers: [{ src: "/assets/eyes/expressive.png", z: LAYER_Z.eyes }],
  },
  {
    id: "look-left",
    name: "Looking left",
    category: "eyes",
    blurb: "Looking left.",
    layers: [{ src: "/assets/eyes/left.png", z: LAYER_Z.eyes }],
  },
  {
    id: "look-right",
    name: "Looking right",
    category: "eyes",
    blurb: "Looking right.",
    layers: [{ src: "/assets/eyes/right.png", z: LAYER_Z.eyes }],
  },

  {
    id: "blonde-side-sweep",
    name: "Blonde Side Sweep",
    category: "hair",
    blurb: "Blonde hair swept to one side.",
    layers: [{ src: "/assets/hair/Blonde Side Sweep.png", z: LAYER_Z.hairFront }],
  },
  {
    id: "navy-long-wave",
    name: "Navy Long Wave",
    category: "hair",
    blurb: "Long navy-blue waves.",
    layers: [{ src: "/assets/hair/Navy Long Wave.png", z: LAYER_Z.hairFront }],
  },
  {
    id: "purple-long-layered",
    name: "Purple Long Layered",
    category: "hair",
    blurb: "Long layered purple hair.",
    layers: [{ src: "/assets/hair/Purple Long Layered.png", z: LAYER_Z.hairFront }],
  },
  {
    id: "short-bob",
    name: "Short Bob",
    category: "hair",
    blurb: "Short bob haircut.",
    layers: [{ src: "/assets/hair/Short Bob.png", z: LAYER_Z.hairFront }],
  },
  {
    id: "cyan-high-bun",
    name: "Cyan High Bun",
    category: "hair",
    blurb: "Cyan hair in a high bun.",
    layers: [{ src: "/assets/hair/cyan High Bun.png", z: LAYER_Z.hairFront }],
  },
  {
    id: "high-bun",
    name: "High bun",
    category: "hair",
    blurb: "Brown bun with a loose strand.",
    layers: [{ src: "/assets/hair/Brown High Bun.png", z: LAYER_Z.hairFront }],
  },
  {
    id: "pink-layered",
    name: "Pink layers",
    category: "hair",
    blurb: "Layered pink hair.",
    layers: [{ src: "/assets/hair/Pink Long Layered.png", z: LAYER_Z.hairFront }],
  },
  {
    id: "purple-wave",
    name: "Purple waves",
    category: "hair",
    blurb: "Long purple waves.",
    layers: [{ src: "/assets/hair/Purple Long Wave.png", z: LAYER_Z.hairFront }],
  },

  {
    id: "casual-shirt",
    name: "Casual shirt",
    category: "top",
    blurb: "Cyan shirt.",
    layers: [{ src: "/assets/top/casual shirt.png", z: LAYER_Z.top }],
  },
  {
    id: "based-tshirt",
    name: "Based T-shirt",
    category: "top",
    blurb: "Based graphic T-shirt.",
    layers: [{ src: "/assets/top/based-tshirt.png", z: LAYER_Z.top }],
  },
  {
    id: "bitcoin-costume",
    name: "Bitcoin Costume",
    category: "top",
    blurb: "Bitcoin-themed outfit.",
    layers: [{ src: "/assets/costumes/bitcoin.png", z: LAYER_Z.top }],
  },
  {
    id: "pumpkin-costume",
    name: "Pumpkin Costume",
    category: "top",
    blurb: "Pumpkin-themed outfit.",
    layers: [{ src: "/assets/costumes/pumpkin.png", z: LAYER_Z.top }],
  },
  {
    id: "rarible-costume",
    name: "Rarible Costume",
    category: "top",
    blurb: "Rarible-themed outfit.",
    layers: [{ src: "/assets/costumes/rarible.png", z: LAYER_Z.top }],
  },
  {
    id: "witch-costume",
    name: "Witch Costume",
    category: "top",
    blurb: "Witch-themed outfit.",
    layers: [{ src: "/assets/costumes/witch.png", z: LAYER_Z.top }],
  },
  {
    id: "red-dress",
    name: "Red Dress",
    category: "top",
    blurb: "Red dress.",
    layers: [{ src: "/assets/dress/red-dress.png", z: LAYER_Z.top }],
  },

  {
    id: "shorts",
    name: "Shorts",
    category: "bottom",
    blurb: "Navy blue shorts.",
    layers: [{ src: "/assets/bottom/shorts.png", z: LAYER_Z.bottom }],
  },
  {
    id: "pants",
    name: "Pants",
    category: "bottom",
    blurb: "Jeans with shoes.",
    layers: [{ src: "/assets/bottom/pants.png", z: LAYER_Z.bottom }],
  },
  {
    id: "skirt",
    name: "Skirt",
    category: "bottom",
    blurb: "Pink ruffled skirt.",
    layers: [{ src: "/assets/bottom/skirt.png", z: LAYER_Z.bottom }],
  },

  {
    id: "black-sneakers",
    name: "Black Sneakers",
    category: "shoes",
    blurb: "Black sneakers.",
    layers: [{ src: "/assets/shoes/black sneakers.png", z: LAYER_Z.shoes }],
  },
  {
    id: "blue-sneakers",
    name: "Blue Sneakers",
    category: "shoes",
    blurb: "Blue sneakers.",
    layers: [{ src: "/assets/shoes/blue sneakers.png", z: LAYER_Z.shoes }],
  },

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
