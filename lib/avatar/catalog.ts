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
    blurb: "Base de cuerpo clara. PNG 990×990 en public/assets/base/light.png.",
    layers: [{ src: "/assets/base/light.png", z: LAYER_Z.base }],
  },
  {
    id: "light-medium",
    name: "Light-Medium",
    category: "base",
    blurb: "Base de cuerpo clara-media. PNG 990×990 en public/assets/base/light-medium.png.",
    layers: [{ src: "/assets/base/light-medium.png", z: LAYER_Z.base }],
  },
  {
    id: "medium",
    name: "Medium",
    category: "base",
    blurb: "Base de cuerpo media. PNG 990×990 en public/assets/base/medium.png.",
    layers: [{ src: "/assets/base/medium.png", z: LAYER_Z.base }],
  },
  {
    id: "medium-deep",
    name: "Medium-Deep",
    category: "base",
    blurb: "Base de cuerpo media-oscura. PNG 990×990 en public/assets/base/medium-deep.png.",
    layers: [{ src: "/assets/base/medium-deep.png", z: LAYER_Z.base }],
  },
  {
    id: "deep",
    name: "Deep",
    category: "base",
    blurb: "Base de cuerpo oscura. PNG 990×990 en public/assets/base/deep.png.",
    layers: [{ src: "/assets/base/deep.png", z: LAYER_Z.base }],
  },

  {
    id: "skin-light",
    name: "Light",
    category: "skin",
    blurb: "Cuerpo claro, detrás de la base.",
    layers: [{ src: "/assets/skin/light.png", z: LAYER_Z.skin }],
  },
  {
    id: "skin-light-medium",
    name: "Light-Medium",
    category: "skin",
    blurb: "Cuerpo claro-medio, detrás de la base.",
    layers: [{ src: "/assets/skin/light-medium.png", z: LAYER_Z.skin }],
  },
  {
    id: "skin-medium",
    name: "Medium",
    category: "skin",
    blurb: "Cuerpo medio, detrás de la base.",
    layers: [{ src: "/assets/skin/medium.png", z: LAYER_Z.skin }],
  },
  {
    id: "skin-medium-deep",
    name: "Medium-Deep",
    category: "skin",
    blurb: "Cuerpo medio-oscuro, detrás de la base.",
    layers: [{ src: "/assets/skin/medium-deep.png", z: LAYER_Z.skin }],
  },
  {
    id: "skin-deep",
    name: "Deep",
    category: "skin",
    blurb: "Cuerpo oscuro, detrás de la base.",
    layers: [{ src: "/assets/skin/deep.png", z: LAYER_Z.skin }],
  },

  {
    id: "expressive",
    name: "Expresivos",
    category: "eyes",
    blurb: "Ojos blancos con pupila.",
    layers: [{ src: "/assets/eyes/expressive.png", z: LAYER_Z.eyes }],
  },
  {
    id: "look-left",
    name: "Izquierda",
    category: "eyes",
    blurb: "Mirada a la izquierda.",
    layers: [{ src: "/assets/eyes/left.png", z: LAYER_Z.eyes }],
  },
  {
    id: "look-right",
    name: "Derecha",
    category: "eyes",
    blurb: "Mirada a la derecha.",
    layers: [{ src: "/assets/eyes/right.png", z: LAYER_Z.eyes }],
  },

  {
    id: "high-bun",
    name: "Moño alto",
    category: "hair",
    blurb: "Moño castaño con mechón.",
    layers: [{ src: "/assets/hair/High Bun.png", z: LAYER_Z.hairFront }],
  },
  {
    id: "pink-layered",
    name: "Capas rosas",
    category: "hair",
    blurb: "Melena rosa en capas.",
    layers: [{ src: "/assets/hair/Pink Long Layered.png", z: LAYER_Z.hairFront }],
  },
  {
    id: "purple-wave",
    name: "Onda violeta",
    category: "hair",
    blurb: "Onda larga violeta.",
    layers: [{ src: "/assets/hair/Purple Long Wave.png", z: LAYER_Z.hairFront }],
  },

  {
    id: "casual-shirt",
    name: "Camisa casual",
    category: "top",
    blurb: "Camisa cian.",
    layers: [{ src: "/assets/top/casual shirt.png", z: LAYER_Z.top }],
  },
  {
    id: "rarible-shirt",
    name: "Camiseta Rarible",
    category: "top",
    blurb: "Camiseta negra y amarilla.",
    layers: [{ src: "/assets/top/Rarible-Shirt.png", z: LAYER_Z.top }],
  },

  {
    id: "shorts",
    name: "Shorts",
    category: "bottom",
    blurb: "Shorts azul marino.",
    layers: [{ src: "/assets/bottom/shorts.png", z: LAYER_Z.bottom }],
  },
  {
    id: "pants",
    name: "Pantalón",
    category: "bottom",
    blurb: "Vaqueros con zapatos.",
    layers: [{ src: "/assets/bottom/pants.png", z: LAYER_Z.bottom }],
  },
  {
    id: "skirt",
    name: "Falda",
    category: "bottom",
    blurb: "Falda rosa con volantes.",
    layers: [{ src: "/assets/bottom/skirt.png", z: LAYER_Z.bottom }],
  },

  {
    id: "cap",
    name: "Gorra",
    category: "accessory",
    slot: "head",
    blurb: "Gorra blanca con visera.",
    layers: [{ src: "/assets/accessory/cap.png", z: LAYER_Z.head }],
  },
  {
    id: "headphones",
    name: "Auriculares",
    category: "accessory",
    slot: "head",
    blurb: "Auriculares con notas.",
    layers: [{ src: "/assets/accessory/headphones.png", z: LAYER_Z.head }],
  },

  {
    id: "based-blue",
    name: "Azul",
    category: "background",
    blurb: "Fondo azul con la sombra al pie.",
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
