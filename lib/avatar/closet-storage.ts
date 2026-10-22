import { sanitizeEquipped, cloneEquipped } from "@/lib/avatar/equipped";
import type { EquippedAvatar } from "@/types/avatar";

export interface SavedOutfit {
  id: string;
  name: string;
  equipped: EquippedAvatar;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "cryptopanim.closet.v1";

function readRaw(): unknown[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalize(value: unknown): SavedOutfit | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.name !== "string" || !row.name.trim()) return null;
  const now = new Date().toISOString();
  return {
    id: row.id,
    name: row.name.trim(),
    equipped: sanitizeEquipped(row.equipped),
    createdAt: typeof row.createdAt === "string" ? row.createdAt : now,
    updatedAt: typeof row.updatedAt === "string" ? row.updatedAt : now,
  };
}

export function listSavedOutfits(): SavedOutfit[] {
  return readRaw().map(normalize).filter((outfit): outfit is SavedOutfit => outfit !== null);
}

function write(outfits: SavedOutfit[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(outfits));
    window.dispatchEvent(new CustomEvent("cryptopanim:closet-updated"));
  }
}

export function saveOutfit(name: string, equipped: EquippedAvatar): SavedOutfit {
  const cleanName = name.trim();
  if (!cleanName) throw new Error("Enter a name for this outfit.");
  const now = new Date().toISOString();
  const outfit: SavedOutfit = {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `outfit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: cleanName,
    equipped: cloneEquipped(equipped),
    createdAt: now,
    updatedAt: now,
  };
  write([outfit, ...listSavedOutfits()]);
  return outfit;
}

export function renameSavedOutfit(id: string, name: string): void {
  const cleanName = name.trim();
  if (!cleanName) throw new Error("Enter a name for this outfit.");
  write(listSavedOutfits().map((outfit) => outfit.id === id ? { ...outfit, name: cleanName, updatedAt: new Date().toISOString() } : outfit));
}

export function updateSavedOutfit(id: string, equipped: EquippedAvatar): void {
  write(listSavedOutfits().map((outfit) => outfit.id === id ? { ...outfit, equipped: cloneEquipped(equipped), updatedAt: new Date().toISOString() } : outfit));
}

export function deleteSavedOutfit(id: string): void {
  write(listSavedOutfits().filter((outfit) => outfit.id !== id));
}
