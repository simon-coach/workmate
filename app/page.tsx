import { FinishGameButton } from "@/components/End";
import { StartGameButton } from "@/components/Start";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useState } from "react";

export default function Home() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [clientSeed, setClientSeed] = useState<string | null>(null);

  const handleStartGame = (id: string, seed: string) => {
    setGameId(id);
    setClientSeed(seed);
  };
  return (
    <div className="bg-red-300 h-96">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
      </SignedIn>
      <h1>Coinflip</h1>
      <StartGameButton onStart={handleStartGame} />
      {gameId && clientSeed && (
        <FinishGameButton clientSeed={clientSeed} gameId={gameId} />
      )}
    </div>
  );
}
