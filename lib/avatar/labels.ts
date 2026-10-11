import type { AccessorySlot, AvatarCategory } from "@/types/avatar";

export const CATEGORY_LABELS: Record<AvatarCategory, string> = {
  base: "Skin",
  skin: "Skin",
  eyes: "Eyes",
  hair: "Hair",
  top: "Tops",
  bottom: "Bottoms",
  shoes: "Shoes",
  accessory: "Accessories",
  background: "Background",
};

export const SLOT_LABELS: Record<AccessorySlot, string> = {
  head: "Head",
  neck: "Neck",
  hands: "Hands",
};
