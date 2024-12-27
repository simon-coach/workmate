import { FinishGameButton } from "@/components/End";
import { StartGameButton } from "@/components/Start";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="bg-red-300 h-96">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <h1>Coinflip</h1>
      <StartGameButton />
      <FinishGameButton />
    </div>
  );
}
