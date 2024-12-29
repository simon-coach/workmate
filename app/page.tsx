"use client";
import React, { useState } from "react";
import { StartGameButton } from "@/components/StartGameButton";
import { FlipRoundButton } from "@/components/FlipRoundButton";

import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useStoreUserEffect } from "./useStoreUserEffect";

export default function Home() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [serverHash, setServerHash] = useState<string | null>(null);
  const [clientSeed, setClientSeed] = useState<string>("my-client-seed");

  // Løbende scoring
  const [scorePlayer, setScorePlayer] = useState<number>(0);
  const [scoreHouse, setScoreHouse] = useState<number>(0);

  // Resultat af sidste runde
  const [lastOutcome, setLastOutcome] = useState<number | null>(null);
  const [playerWonRound, setPlayerWonRound] = useState<boolean | null>(null);

  // Er spillet færdigt?
  const [complete, setComplete] = useState<boolean>(false);
  const [winner, setWinner] = useState<string>("");

  // Afsløret serverSeed, når spillet er slut
  const [revealedSeed, setRevealedSeed] = useState<string | null>(null);

  // Kaldet fra StartGameButton
  const handleGameStarted = (id: string, hash: string) => {
    setGameId(id);
    setServerHash(hash);

    // Nulstil
    setScorePlayer(0);
    setScoreHouse(0);
    setLastOutcome(null);
    setPlayerWonRound(null);
    setComplete(false);
    setWinner("");
    setRevealedSeed(null);
  };

  // Kaldet fra FlipRoundButton
  const handleFlipResult = (result: any) => {
    if (result.error) {
      console.error(result.error);
      return;
    }
    setLastOutcome(result.outcome);
    setPlayerWonRound(result.playerWonRound);
    setScorePlayer(result.scorePlayer);
    setScoreHouse(result.scoreHouse);
    setComplete(result.complete);
    setWinner(result.winner || "");

    // Hvis spillet lige blev færdigt, returnerer vi serverSeed
    if (result.complete && result.serverSeed) {
      setRevealedSeed(result.serverSeed);
    }
  };

  const { isLoading, isAuthenticated } = useStoreUserEffect();

  return (
    <div className="w-full bg-[#0e0e0e] h-full rounded-2xl  p-4">
      <StartGameButton onGameStarted={handleGameStarted} />
      {isLoading ? (
        <>Loading...</>
      ) : !isAuthenticated ? (
        <SignInButton />
      ) : (
        <>
          <UserButton />
        </>
      )}
      {gameId && (
        <div style={{ marginTop: 20 }}>
          <div>
            <label>Server Hash:</label>
            <input
              type="text"
              value={serverHash ?? ""}
              readOnly
              style={{ width: 300 }}
            />
          </div>
          <div style={{ marginTop: 10 }}>
            <label>Client Seed:</label>
            <input
              type="text"
              value={clientSeed}
              onChange={(e) => setClientSeed(e.target.value)}
            />
          </div>

          {/* Vis "Flip Next Round"-knap, så længe spillet ikke er slut */}
          {!complete && (
            <div style={{ marginTop: 10 }}>
              <p>Player Score: {scorePlayer}</p>
              <p>House Score: {scoreHouse}</p>
              <FlipRoundButton
                gameId={gameId}
                clientSeed={clientSeed}
                onFlip={handleFlipResult}
              />
            </div>
          )}

          {/* Vis resultat af sidste runde, hvis vi har flippet mindst én gang */}
          {lastOutcome !== null && !complete && (
            <p style={{ marginTop: 10 }}>
              Sidste flip var {lastOutcome === 0 ? "Heads (CT)" : "Tails (T)"} →{" "}
              {playerWonRound ? "Spilleren" : "Huset"} vandt runden
            </p>
          )}

          {/* Hvis spillet er færdigt */}
          {complete && (
            <div style={{ marginTop: 20 }}>
              <h3>Spillet er slut</h3>
              <p>
                Slutstilling: {scorePlayer} - {scoreHouse}
              </p>
              <p>Vinder: {winner === "player" ? "Spilleren" : "Huset"}</p>
              {revealedSeed && (
                <p>
                  Server Seed: <strong>{revealedSeed}</strong>
                  <br />
                  Verificér at SHA-256({revealedSeed}) = {serverHash}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
