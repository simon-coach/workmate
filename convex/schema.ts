import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  // Coinflip
  games: defineTable({
    // For "Provably Fair"
    serverSeed: v.string(),
    hash: v.string(),
    nonce: v.number(), // vil incrementes for hver runde

    // Hvilken side spilleren har valgt (CT/T)
    chosenSide: v.string(),

    // Bedst ud af X
    bestOf: v.string(),
    scorePlayer: v.number(),
    scoreHouse: v.number(),

    // Er spillet færdigt?
    complete: v.boolean(),
    winner: v.string(),
  }),
});
