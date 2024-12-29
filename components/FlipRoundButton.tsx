"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import React from "react";
import { Button } from "./ui/button";

interface FlipRoundProps {
  gameId: string;
  clientSeed: string;
  onFlip: (result: any) => void; // Du kan tilføje en præcis type
}

export function FlipRoundButton({
  gameId,
  clientSeed,
  onFlip,
}: Readonly<FlipRoundProps>) {
  const flipRound = useMutation(api.functions.flipRounds.flipRound);

  const handleFlip = async () => {
    try {
      const result = await flipRound({ gameId, clientSeed });
      onFlip(result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button onClick={handleFlip} variant="secondary">
      Flip Next Round
    </Button>
  );
}
