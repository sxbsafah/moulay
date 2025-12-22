import { ConvexError } from "convex/values";
import { ZodError } from "zod";

export function throwValidation(error: ZodError) {
  const fieldErrors: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const field = issue.path[0]?.toString() ?? "root";
    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  });
  return new ConvexError({
    code: "VALIDATION_ERROR",
    message: `Invalid input data`,
    details: fieldErrors,
  });
}

