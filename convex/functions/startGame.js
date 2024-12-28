import { mutation } from "../_generated/server";

export const startGame = mutation(async ({ db }) => {
  // 1) Generer server-seed (32 bytes random):
  const serverSeed = Array.from(
    new Uint8Array(globalThis.crypto.getRandomValues(new Uint8Array(32)))
  )
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // 2) Beregn SHA-256 hash
  const hashBuffer = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(serverSeed)
  );
  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // 3) Sæt nonce = 0 (hvis du vil have flere flips under samme seed, kan du øge den senere)
  const nonce = 0;

  // 4) Gem i databasen
  const gameId = await db.insert("games", {
    serverSeed,
    hash,
    nonce,
  });

  // 5) Returnér kun det nødvendige
  return {
    gameId,
    hash, // Viser kun hash til klienten
  };
});
