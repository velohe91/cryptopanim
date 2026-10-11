import { AvatarProvider } from "@/components/avatar/AvatarProvider";
import { DressingRoom } from "@/components/avatar/DressingRoom";

export default function HomePage() {
  return (
    <AvatarProvider>
      <DressingRoom />
    </AvatarProvider>
  );
}
