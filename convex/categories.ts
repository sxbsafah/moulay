import { query } from "./_generated/server";
import { ConvexError } from "convex/values";
import checkPermission from "../src/lib/checkPermission";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAllCategories = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "unauthorized",
        message: "L'utilisateur doit être authentifié pour voir les catégories",
        details: {
          root: "Veuillez vous connecter pour voir les catégories",
        },
      });
    }
    const hasAccess = await checkPermission(ctx, userId, "staff");
    if (!hasAccess) {
      throw new ConvexError({
        code: "unauthorized",
        message: "L'utilisateur n'a pas la permission de voir les catégories",
        details: {
          root: "Vous devez être administrateur ou staff pour voir les catégories",
        },
      });
    }
    return await ctx.db.query("categories").collect();
  },
});
