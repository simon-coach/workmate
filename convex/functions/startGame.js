import { mutation } from "../_generated/server";

export const startGame = mutation(async ({ db }) => {
  // Generer server-seed og hash ved hjælp af webcrypto
  const serverSeed = Array.from(
    new Uint8Array(globalThis.crypto.getRandomValues(new Uint8Array(32)))
  )
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const hashBuffer = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(serverSeed)
  );

  const hash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const gameId = await db.insert("games", { serverSeed, hash, nonce: 0 });

  return { gameId, hash };
});
