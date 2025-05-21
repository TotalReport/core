import { z } from "zod";

type ZodType = typeof z;

// https://github.com/colinhacks/zod/issues/1630
export const zBoolean = (z: ZodType) => {
  return z
    .union([z.boolean(), z.literal("true"), z.literal("false")])
    .transform((value) => value === true || value === "true");
};
