import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { passwordResetSchema, signUpSchema } from "../src/schemas/schemas";
import { ResendOTP, ResendOTPPasswordReset } from "../src/lib/resend";
import { throwValidation } from "../src/lib/throwValidation";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      verify: ResendOTP,
      reset: ResendOTPPasswordReset,
      profile: (params, _ctx) => {
        "";
        if (params.flow === "signUp") {
          const parsed = signUpSchema.safeParse(params);
          if (!parsed.success) {
            throw throwValidation(parsed.error);
          }
        }
        return {
          email: params.email as string,
          firstname: (params.firstname as string) || "",
          lastname: (params.lastname as string) || "",
          role: "user",
        };
      },
      validatePasswordRequirements: (password: string) => {
        const result =
          passwordResetSchema.shape.newPassword.safeParse(password);
        if (!result.success) {
          throw throwValidation(result.error);
        }
      },
    }),
  ],
});
