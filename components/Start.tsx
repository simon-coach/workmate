import { useMutation } from "convex/react";

interface StartGameButtonProps {
  onStart: (id: string, seed: string) => void;
}

export const StartGameButton: React.FC<StartGameButtonProps> = ({
  onStart,
}) => {
  const startGame = useMutation("startGame");

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
