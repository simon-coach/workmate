"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export const FinishGameButton = ({
  clientSeed,
  gameId,
}: {
  clientSeed: string;
  gameId: string;
}) => {
  const finishGame = useMutation(api.functions.finishGame.finishGame);

  const handleFinishGame = async () => {
    try {
      const result = await finishGame({ clientSeed, gameId });
      console.log("Game finished:", result);
    } catch (error) {
      console.error("Error finishing game:", error);
    }
  };

  return <button onClick={handleFinishGame}>Finish Game</button>;
};
