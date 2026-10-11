"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  dispatchAvatar,
  getAvatarSnapshot,
  getServerAvatarSnapshot,
  subscribeAvatar,
} from "@/lib/avatar/browser-store";
import type { EquippedAvatar } from "@/types/avatar";

interface AvatarContextValue {
  equipped: EquippedAvatar;
  canUndo: boolean;
  equip: (itemId: string) => void;
  unequip: (itemId: string) => void;
  reset: () => void;
  naked: () => void;
  undo: () => void;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

export function AvatarProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribeAvatar, getAvatarSnapshot, getServerAvatarSnapshot);

  const value = useMemo<AvatarContextValue>(
    () => ({
      equipped: state.equipped,
      canUndo: state.past.length > 0,
      equip: (itemId) => dispatchAvatar({ type: "equip", itemId }),
      unequip: (itemId) => dispatchAvatar({ type: "unequip", itemId }),
      reset: () => dispatchAvatar({ type: "reset" }),
      naked: () => dispatchAvatar({ type: "naked" }),
      undo: () => dispatchAvatar({ type: "undo" }),
    }),
    [state],
  );

  return <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>;
}

export function useAvatar(): AvatarContextValue {
  const value = useContext(AvatarContext);
  if (!value) {
    throw new Error("useAvatar must be used within AvatarProvider");
  }
  return value;
}
