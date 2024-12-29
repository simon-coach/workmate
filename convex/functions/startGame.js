import { mutation } from "../_generated/server";

export const startGame = mutation(async ({ db }, { chosenSide, bestOf }) => {
  // 1) Generér serverSeed
  const serverSeed = Array.from(
    new Uint8Array(globalThis.crypto.getRandomValues(new Uint8Array(32)))
  )
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // 2) Hash serverSeed med SHA-256
  const hashBuffer = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(serverSeed)
  );
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // 3) Startværdier
  const nonce = 0;
  const scorePlayer = 0;
  const scoreHouse = 0;
  const complete = false;
  const winner = "";

  // 4) Opret række i "games"-tabellen
  const gameId = await db.insert("games", {
    serverSeed,
    hash,
    nonce,
    chosenSide, // "CT" eller "T"
    bestOf, // gemmes som string, fx "3"
    scorePlayer,
    scoreHouse,
    complete,
    winner,
  });

  // 5) Returnér ID + hash
  return {
    gameId,
    hash, // Viser kun hash til klienten
  };
});
