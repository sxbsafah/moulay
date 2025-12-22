import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";


export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get("users",userId);
    if (!user) {
      return null;
    }
    return {  firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role  };
  }
})