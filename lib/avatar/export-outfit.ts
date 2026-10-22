import { resolveLayers } from "@/lib/avatar/resolve-layers";
import { AVATAR_FRAME, type EquippedAvatar } from "@/types/avatar";

export async function exportOutfitPng(equipped: EquippedAvatar, name: string, size = 2048): Promise<void> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create the outfit image.");
  context.imageSmoothingEnabled = false;
  context.fillStyle = "#12141c";
  context.fillRect(0, 0, size, size);

  const layers = resolveLayers(equipped);
  const images = await Promise.all(layers.map((layer) => new Promise<{ image: HTMLImageElement; z: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ image, z: layer.z });
    image.onerror = () => reject(new Error(`Could not load ${layer.src}`));
    image.src = layer.src;
  })));

  images.sort((a, b) => a.z - b.z);
  for (const { image } of images) {
    context.drawImage(image, 0, 0, AVATAR_FRAME.width, AVATAR_FRAME.height, 0, 0, size, size);
  }

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Could not export PNG.")), "image/png"));
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name.trim().replace(/[^a-z0-9-_]+/gi, "-").replace(/^-|-$/g, "") || "cryptopanim-outfit"}-${size}x${size}.png`;
  link.click();
  URL.revokeObjectURL(url);
}
