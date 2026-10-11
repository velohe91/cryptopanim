import type { AccessorySlot, AvatarCategory } from "@/types/avatar";

export const CATEGORY_LABELS: Record<AvatarCategory, string> = {
  base: "Skin",
  skin: "Piel",
  eyes: "Ojos",
  hair: "Cabello",
  top: "Superior",
  bottom: "Inferior",
  accessory: "Accesorios",
  background: "Fondo",
};

export const SLOT_LABELS: Record<AccessorySlot, string> = {
  head: "Cabeza",
  neck: "Cuello",
  hands: "Manos",
};
