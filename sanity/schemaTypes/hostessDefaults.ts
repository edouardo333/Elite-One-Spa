import type { InitialValueResolverContext } from "sanity";
import { apiVersion } from "../env";

// Auto-fills for fields that are hidden from Studio staff (see hostess.ts).
// These only run when a NEW document is created — they exist purely so the
// website always has something sensible to render (a gradient behind the
// portrait, a star rating) without ever asking a non-technical editor to
// pick a hex color or a display order number.

const GRADIENT_PALETTE: [string, string][] = [
  ["#4a1626", "#e87896"],
  ["#2a1420", "#c69a72"],
  ["#4a1626", "#e8c9ab"],
  ["#2a1420", "#e87896"],
  ["#4a1626", "#c69a72"],
  ["#2a1420", "#f2ddc3"],
];

async function hostessCount(context: InitialValueResolverContext): Promise<number> {
  const client = context.getClient({ apiVersion });
  return client.fetch(`count(*[_type == "hostess"])`);
}

export async function autoGradientFrom(_: unknown, context: InitialValueResolverContext) {
  const count = await hostessCount(context);
  return GRADIENT_PALETTE[count % GRADIENT_PALETTE.length][0];
}

export async function autoGradientTo(_: unknown, context: InitialValueResolverContext) {
  const count = await hostessCount(context);
  return GRADIENT_PALETTE[count % GRADIENT_PALETTE.length][1];
}

// New hostesses are appended to the end of the list by default (existing
// seeded documents are spaced by 10: 0, 10, 20…), so staff never have to
// think about ordering unless they specifically want to change it in the
// optional "Advanced" tab.
export async function autoDisplayOrder(_: unknown, context: InitialValueResolverContext) {
  const client = context.getClient({ apiVersion });
  const maxOrder: number | null = await client.fetch(
    `math::max(*[_type == "hostess"].displayOrder)`
  );
  return (maxOrder ?? 0) + 10;
}
