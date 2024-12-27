"use client";

import { useMutation } from "convex/react"; // Hook til mutationer

export const StartGameButton = () => {
  const startGame = useMutation("startGame");

  const handleStartGame = async () => {
    try {
      const result = await startGame();
      console.log("Game started:", result);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  return <button onClick={handleStartGame}>Start Game</button>;
};
