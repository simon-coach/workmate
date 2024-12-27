import { mutation } from "../_generated/server";

export const finishGame = mutation(async ({ db }, { clientSeed, gameId }) => {
  const game = await db.get(gameId);

  if (!game) {
    throw new Error("Game not found");
  }

  const { serverSeed, nonce } = game;

  const hashBuffer = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(serverSeed + clientSeed + nonce)
  );

  const resultHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const outcome = parseInt(resultHash.slice(0, 8), 16) % 2;

  return { outcome, serverSeed };
});
