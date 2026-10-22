import type { Metadata } from "next";
import PixelStudioEditor from "./PixelStudioEditor";

export const metadata: Metadata = {
  title: "Panim Pixel Studio — CryptoPanim",
  description: "A local-first pixel art and animation studio for CryptoPanim creators.",
};

export default function PixelStudioPage() {
  return <PixelStudioEditor />;
}
