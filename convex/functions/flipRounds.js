import { mutation } from "../_generated/server";

export const flipRound = mutation(async ({ db }, { gameId, clientSeed }) => {
  // 1) Find spillet i databasen
  const game = await db.get(gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  const {
    serverSeed,
    nonce,
    chosenSide,
    bestOf,
    scorePlayer,
    scoreHouse,
    complete,
    winner,
  } = game;

  // 2) Er spillet allerede færdigt?
  if (complete) {
    return {
      error: "Game is already complete",
      outcome: null,
      scorePlayer,
      scoreHouse,
      winner,
      serverSeed, // hvis du vil vise det alligevel
    };
  }

  // 3) Beregn outcome: 0 (Heads) eller 1 (Tails)
  const hashBuffer = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(serverSeed + clientSeed + nonce)
  );
  const resultHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const outcome = parseInt(resultHash.slice(0, 8), 16) % 2; // 0=Heads, 1=Tails

  // 4) Bestem, om spilleren vandt denne runde
  let newScorePlayer = scorePlayer;
  let newScoreHouse = scoreHouse;

  const playerWonRound =
    (outcome === 0 && chosenSide === "CT") ||
    (outcome === 1 && chosenSide === "T");

  if (playerWonRound) {
    newScorePlayer++;
  } else {
    newScoreHouse++;
  }

  // 5) Tjek om nogen har vundet "bedst ud af X"
  // bestOf er en streng, så parse den
  const bestOfNum = parseInt(bestOf, 10) || 1; // fallback til 1, hvis parsing fejler
  const neededToWin = Math.ceil(bestOfNum / 2);

  let newComplete = false;
  let newWinner = winner;

  if (newScorePlayer >= neededToWin) {
    newComplete = true;
    newWinner = "player";
  } else if (newScoreHouse >= neededToWin) {
    newComplete = true;
    newWinner = "house";
  }

  // 6) Inkrementer nonce
  const newNonce = nonce + 1;

  // 7) Gem ændringer i databasen
  await db.patch(gameId, {
    nonce: newNonce,
    scorePlayer: newScorePlayer,
    scoreHouse: newScoreHouse,
    complete: newComplete,
    winner: newWinner,
  });

  // 8) Returnér info om denne runde
  return {
    error: null,
    outcome, // 0=Heads, 1=Tails
    playerWonRound,
    scorePlayer: newScorePlayer,
    scoreHouse: newScoreHouse,
    complete: newComplete,
    winner: newWinner,
    // Hvis du vil afsløre serverSeed nu (kun efter matchen er slut):
    serverSeed: newComplete ? serverSeed : null,
  };
});
