"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

interface StartGameButtonProps {
  onStart: (gameId: string, serverHash: string) => void;
}

export const StartGameButton: React.FC<StartGameButtonProps> = ({
  onStart,
}) => {
  const startGame = useMutation(api.functions.startGame.startGame);

  const handleClick = async () => {
    try {
      const { gameId, hash } = await startGame();
      onStart(gameId, hash);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  return (
    <button onClick={handleClick} className="bg-green-600 p-2 rounded">
      Start Game
    </button>
  );
};
