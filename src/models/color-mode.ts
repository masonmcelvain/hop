import { z } from "zod";
import { safeParse } from "../helpers/generic-helpers";

const ColorModeSchema = z.union([z.literal("light"), z.literal("dark")]);

export function parseColorMode(input: unknown) {
  return safeParse(input, ColorModeSchema);
}
