import { getItem } from "@/lib/avatar/catalog";
import { ACCESSORY_SLOTS, type EquippedAvatar } from "@/types/avatar";

export interface ResolvedLayer {
  key: string;
  src: string;
  z: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Flattens the equipped outfit into paint order.
 *
 * The renderer should stay dumb: it draws this list and nothing else.
 * Adding a slot means resolving it here (and in `EquippedAvatar`), not
 * inside the component.
 */
export function resolveLayers(equipped: EquippedAvatar): ResolvedLayer[] {
  const ids: Array<string | null | undefined> = [
    equipped.backgroundId,
    equipped.hairId,
    equipped.skinId,
    equipped.baseId,
    equipped.bottomId,
    equipped.shoesId,
    equipped.topId,
    equipped.eyesId,
  ];

  for (const slot of ACCESSORY_SLOTS) {
    ids.push(equipped.accessories[slot]);
  }

  const layers: ResolvedLayer[] = [];

  for (const id of ids) {
    if (!id) continue;
    const item = getItem(id);
    if (!item) continue;
    item.layers.forEach((layer, index) => {
      layers.push({
        key: `${item.id}:${index}:${layer.src}`,
        src: layer.src,
        z: layer.z,
        offsetX: layer.offsetX ?? 0,
        offsetY: layer.offsetY ?? 0,
      });
    });
  }

  layers.sort((a, b) => a.z - b.z || a.key.localeCompare(b.key));
  return layers;
}
