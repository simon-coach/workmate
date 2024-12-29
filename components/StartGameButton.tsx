"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { ShieldCheck } from "lucide-react";

interface StartGameProps {
  onGameStarted: (gameId: string, serverHash: string) => void;
}

export function StartGameButton({ onGameStarted }: Readonly<StartGameProps>) {
  const startGame = useMutation(api.functions.startGame.startGame);

  const [side, setSide] = useState<"CT" | "T">("CT");
  const [bestOf, setBestOf] = useState<string>("3");

  const handleStart = async () => {
    try {
      const { gameId, hash } = await startGame({ chosenSide: side, bestOf });
      onGameStarted(gameId, hash);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-between bg-neutral-900 rounded-lg p-1.5">
      <div className="flex items-center gap-4">
        <div className="flex">
          <label
            className={`flex items-center justify-center w-10 h-10 cursor-pointer border border-neutral-800 rounded-l-md p-2 ${side === "CT" && "bg-neutral-800"}`}
          >
            <input
              type="radio"
              checked={side === "CT"}
              onChange={() => setSide("CT")}
              className="hidden"
            />
            <Image src={"./ct_icon.svg"} width={40} height={40} alt="CT" />
          </label>
          <label
            className={`flex items-center justify-center w-10 h-10 cursor-pointer border border-neutral-800 rounded-r-md p-1.5 ${side === "T" && "bg-neutral-800"}`}
          >
            <input
              type="radio"
              checked={side === "T"}
              onChange={() => setSide("T")}
              className="hidden"
            />
            <Image src={"./t_icon.svg"} width={48} height={48} alt="T" />
          </label>
        </div>
        <Select value={bestOf} onValueChange={(value) => setBestOf(value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Vælg antal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-neutral-600">Provably fair </p>
          <ShieldCheck className="text-neutral-600" />
        </div>
        <Button variant="secondary" onClick={handleStart}>
          Start Game
        </Button>
      </div>
    </div>
  );
}
