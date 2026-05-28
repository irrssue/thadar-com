import { randomInt } from "node:crypto";

// Crockford-ish alphabet: excludes 0, O, 1, I, L to avoid visual confusion.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const LENGTH = 7;

export function generateInviteCode(): string {
  let out = "";
  for (let i = 0; i < LENGTH; i++) {
    out += ALPHABET[randomInt(0, ALPHABET.length)];
  }
  return out;
}
