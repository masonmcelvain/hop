import { ZodSchema } from "zod";

export function safeParse<Output>(input: unknown, schema: ZodSchema<Output>) {
  const result = schema.safeParse(input);
  return result.success ? result.data : undefined;
}
