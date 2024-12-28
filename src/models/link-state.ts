import { safeParse } from "@helpers/generic-helpers";
import { z } from "zod";

const LinkDataSchema = z.object({
   id: z.number(),
   name: z.string(),
   url: z.string(),
   imageUrl: z.string(),
});
export type LinkData = z.infer<typeof LinkDataSchema>;

const LinkKeysSchema = z.array(z.string());
const StoredLinkDataListSchema = z.record(z.string(), LinkDataSchema);
const NextLinkIdSchema = z.number();

const _LinkStateSchema = z.object({
   linkKeys: LinkKeysSchema,
   links: z.array(LinkDataSchema),
   nextLinkId: NextLinkIdSchema,
});
export type LinkState = z.infer<typeof _LinkStateSchema>;

export function parseNextLinkId(input: unknown) {
   return safeParse(input, NextLinkIdSchema);
}

export function parseLinkKeys(input: unknown) {
   return safeParse(input, LinkKeysSchema);
}

export function parseStoredLinks(input: unknown) {
   return safeParse(input, StoredLinkDataListSchema);
}
