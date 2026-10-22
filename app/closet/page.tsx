import { AvatarProvider } from "@/components/avatar/AvatarProvider";
import { Closet } from "@/components/avatar/Closet";

export const metadata = {
  title: "CryptoPanim — My Closet",
  description: "Browse, manage, and download your saved CryptoPanim outfits.",
};

export default function ClosetPage() {
  return <AvatarProvider><Closet /></AvatarProvider>;
}
