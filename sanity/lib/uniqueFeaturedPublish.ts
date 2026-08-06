import { useClient } from "sanity";
import type { DocumentActionComponent } from "sanity";
import { useToast } from "@sanity/ui";
import { apiVersion } from "../env";

// Only ever one document's `featured` field may be true after publishing —
// see hostess.ts. A boolean alone can't guarantee that; this wraps Studio's
// built-in Publish action for the `hostess` type so uniqueness is enforced
// automatically, not left to the editor to remember.
//
// How it works:
//  1. Before the real publish runs, if the document being published has
//     `featured: true`, fetch every *other* published hostess that
//     currently has `featured: true`.
//  2. If any exist, clear them in ONE atomic transaction (all-or-nothing —
//     never a state where a patch partially applies).
//  3. Only then does the normal, untouched Publish action run for this
//     document.
//
// Failure is safe-by-default: if step 2 fails, publishing is aborted with a
// toast instead of risking two featured hostesses. The only inconsistent
// state this can ever transiently produce is momentarily ZERO featured
// hostesses (never two) — and the homepage already falls back gracefully to
// the first active hostess by Position on the Page when nobody is featured
// (see app/components/sections/Hostesses.tsx), so that is not a problem.
export function withUniqueFeaturedPublish(
  originalPublishAction: DocumentActionComponent
): DocumentActionComponent {
  const WrappedPublishAction: DocumentActionComponent = (props) => {
    const original = originalPublishAction(props);
    const client = useClient({ apiVersion });
    const toast = useToast();

    if (!original) return original;

    return {
      ...original,
      onHandle: async () => {
        const draftFeatured = (props.draft as { featured?: boolean } | null)?.featured;
        const publishedFeatured = (props.published as { featured?: boolean } | null)?.featured;
        const isBeingFeatured = draftFeatured ?? publishedFeatured ?? false;

        if (isBeingFeatured) {
          try {
            const publishedClient = client.withConfig({ perspective: "published" });
            const otherFeaturedIds = await publishedClient.fetch<string[]>(
              `*[_type == "hostess" && featured == true && _id != $id]._id`,
              { id: props.id }
            );

            if (otherFeaturedIds.length > 0) {
              const tx = publishedClient.transaction();
              for (const id of otherFeaturedIds) {
                tx.patch(id, (p) => p.set({ featured: false }));
              }
              await tx.commit();
            }
          } catch (error) {
            toast.push({
              status: "error",
              title: "Couldn't confirm this is the only featured hostess",
              description:
                "Publish was cancelled so two hostesses can never end up featured at the same time. Please try again.",
            });
            console.error("[hostess featured uniqueness] clear-others transaction failed:", error);
            return;
          }
        }

        original.onHandle?.();
      },
    };
  };

  WrappedPublishAction.action = originalPublishAction.action;
  return WrappedPublishAction;
}
