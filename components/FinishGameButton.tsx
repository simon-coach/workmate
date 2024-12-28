"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

interface FinishGameButtonProps {
  gameId: string;
  clientSeed: string;
  onFinish: (result: { outcome: number; serverSeed: string }) => void;
}

export const FinishGameButton: React.FC<FinishGameButtonProps> = ({
  gameId,
  clientSeed,
  onFinish,
}) => {
  const finishGame = useMutation(api.functions.finishGame.finishGame);

  const handleClick = async () => {
    try {
      const result = await finishGame({ clientSeed, gameId });
      // result = { outcome, serverSeed }
      onFinish(result);
    } catch (error) {
      console.error("Error finishing game:", error);
    }
  };

  return (
    <button onClick={handleClick} className="bg-red-600 p-2 rounded">
      Finish Game
    </button>
  );
};
