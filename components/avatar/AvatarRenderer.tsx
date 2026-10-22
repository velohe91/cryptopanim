"use client";

import { useMemo } from "react";
import { describeAvatar } from "@/lib/avatar/equipped";
import { resolveLayers } from "@/lib/avatar/resolve-layers";
import { AVATAR_FRAME, type EquippedAvatar } from "@/types/avatar";
import styles from "./AvatarRenderer.module.css";

interface AvatarRendererProps {
  equipped: EquippedAvatar;
}

/**
 * Stacks full-frame sprites in paint order.
 *
 * Every PNG is `AVATAR_FRAME` (990×990). Each layer fills the square stage
 * from the same origin, so body, clothes, hair, and accessories line up.
 * `offsetX` / `offsetY` are source pixels for future art that is not
 * full-frame. Swap this img stack for Canvas 2D here if a later renderer
 * needs palette swaps — keep `resolveLayers()` as the input.
 */
export function AvatarRenderer({ equipped }: AvatarRendererProps) {
  const layers = useMemo(() => resolveLayers(equipped), [equipped]);
  const label = describeAvatar(equipped);

  return (
    <div
      className={styles.stage}
      role="img"
      aria-label={label || "Avatar"}
      style={{ aspectRatio: `${AVATAR_FRAME.width} / ${AVATAR_FRAME.height}` }}
    >
      {layers.map((layer) => {
        const nudgeX = (layer.offsetX / AVATAR_FRAME.width) * 100;
        const nudgeY = (layer.offsetY / AVATAR_FRAME.height) * 100;
        const nudged = layer.offsetX !== 0 || layer.offsetY !== 0;

        return (
          // Pixel placeholders are same-origin static files. next/image
          // resamples them and fights image-rendering: pixelated.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={layer.key}
            src={layer.src}
            alt=""
            width={AVATAR_FRAME.width}
            height={AVATAR_FRAME.height}
            draggable={false}
            className={styles.layer}
            style={{
              zIndex: layer.z,
              transform: nudged ? `translate(${nudgeX}%, ${nudgeY}%)` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
