import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api"; // Sørg for korrekt sti

interface StartGameButtonProps {
  onStart: (id: string, seed: string) => void;
}

export const StartGameButton: React.FC<StartGameButtonProps> = ({
  onStart,
}) => {
  const startGame = useMutation(api.functions.startGame.startGame);

  const handleStartGame = async () => {
    try {
      const result = await startGame();
      const id = result.gameId;
      const seed = result.hash;
      onStart(id, seed);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  return <button onClick={handleStartGame}>Start Game</button>;
};
