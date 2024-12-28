"use client";
import React, { useState } from "react";
import { StartGameButton } from "@/components/StartGameButton";
import { FinishGameButton } from "@/components/FinishGameButton";

export default function Home() {
  // --- HER er alt dit eksisterende coinflip-state ---
  const [gameId, setGameId] = useState<string | null>(null);
  const [serverHash, setServerHash] = useState<string | null>(null);
  const [clientSeed, setClientSeed] = useState<string>("my-client-seed");
  const [outcome, setOutcome] = useState<number | null>(null);
  const [revealedServerSeed, setRevealedServerSeed] = useState<string | null>(
    null
  );

  const handleStartGame = (id: string, hash: string) => {
    setGameId(id);
    setServerHash(hash);
    setOutcome(null);
    setRevealedServerSeed(null);
  };

  const handleFinishGame = (result: {
    outcome: number;
    serverSeed: string;
  }) => {
    setOutcome(result.outcome);
    setRevealedServerSeed(result.serverSeed);
  };

  // --- HER kommer vores "hashing-demo" state og funktion ---
  const [hashInput, setHashInput] = useState("");
  const [hashOutput, setHashOutput] = useState("");

  // Denne funktion bruger Web Crypto API’et til at beregne SHA-256
  const handleComputeHash = async () => {
    if (!hashInput) return;

    // 1) Lav en buffer ud fra input-strengen
    const encoder = new TextEncoder();
    const data = encoder.encode(hashInput);

    // 2) Beregn SHA-256
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // 3) Konverter fra ArrayBuffer -> hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    setHashOutput(hashHex);
  };

  return (
    <div style={{ padding: 20 }} className="bg-white">
      {/* 1) Start spil */}
      <StartGameButton onStart={handleStartGame} />

      {gameId && (
        <div style={{ marginTop: 20 }}>
          <label>Server Hash: </label>
          <input
            type="text"
            value={serverHash ?? ""}
            readOnly
            style={{ width: 320 }}
          />

          <div style={{ marginTop: 10 }}>
            <label>Client Seed: </label>
            <input
              type="text"
              value={clientSeed}
              onChange={(e) => setClientSeed(e.target.value)}
            />
          </div>

          {/* Afslut spil */}
          <FinishGameButton
            gameId={gameId}
            clientSeed={clientSeed}
            onFinish={handleFinishGame}
          />
        </div>
      )}

      {outcome !== null && revealedServerSeed && (
        <div className="mt-2 bg-gray-200 p-2">
          <h2 className="font-bold">
            Resultat: {outcome === 0 ? "Heads" : "Tails"}
          </h2>
          <p>
            Server Seed (afsløret): <strong>{revealedServerSeed}</strong>
          </p>
          <p>
            <i>
              Verificér selv ved at køre SHA-256 på{" "}
              <code>{revealedServerSeed}</code> og sammenligne med{" "}
              <code>{serverHash}</code>.
            </i>
          </p>
        </div>
      )}

      {/* --- Indsæt en sektion for at vise, hvordan man hasher en vilkårlig streng --- */}
      <div style={{ marginTop: 40 }}>
        <h2>Hashing Demo</h2>
        <p>Indtast en vilkårlig streng, og se dens SHA-256 hash:</p>
        <div>
          <input
            type="text"
            placeholder="Indtast tekst..."
            value={hashInput}
            onChange={(e) => setHashInput(e.target.value)}
            style={{ width: 300 }}
          />
          <button onClick={handleComputeHash}>Compute SHA-256</button>
        </div>
        {hashOutput && (
          <div style={{ marginTop: 10 }}>
            <strong>SHA-256 hash:</strong>
            <p>{hashOutput}</p>
          </div>
        )}
      </div>
    </div>
  );
}
