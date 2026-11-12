import "server-only";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function hashCode(code: string, salt = randomBytes(16).toString("hex")) {
  const hash = scryptSync(code, salt, 64).toString("hex");
  return { hash, salt };
}

export function matchesCode(code: string, hash: string, salt: string) {
  const a = scryptSync(code, salt, 64);
  const b = Buffer.from(hash, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}
