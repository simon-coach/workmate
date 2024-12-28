import { mutation } from "../_generated/server";

export const finishGame = mutation(async ({ db }, { clientSeed, gameId }) => {
  // 1) Find spillet
  const game = await db.get(gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  const { serverSeed, nonce } = game;

  // 2) Beregn SHA-256(serverSeed + clientSeed + nonce)
  const hashBuffer = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(serverSeed + clientSeed + nonce)
  );
  const resultHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // 3) outcome = parseInt(de første 8 hex-chars, 16) % 2
  const outcome = parseInt(resultHash.slice(0, 8), 16) % 2;

  // 4) Returnér udfald + det hemmeligholdte serverSeed
  return {
    outcome,
    serverSeed, // Kan nu bekræftes mod den tidligere hash
  };
});
