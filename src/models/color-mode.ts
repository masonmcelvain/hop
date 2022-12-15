import { safeParse } from "@helpers/generic-helpers";
import { z } from "zod";

const ColorModeSchema = z.union([z.literal("light"), z.literal("dark")]);

export function parseColorMode(input: unknown) {
  return safeParse(input, ColorModeSchema);
}
