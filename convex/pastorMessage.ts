import { query } from "./_generated/server";

export const getPastorMessage = query({
  args: {},
  handler: async (context) => {
    return await context.db.query("pastorMessage").first();
  },
});
