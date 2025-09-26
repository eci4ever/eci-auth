import { randomBytes } from "crypto";

// ===== Token Utils =====
export function createRandomToken(length = 48): string {
  return randomBytes(length).toString("hex");
}
