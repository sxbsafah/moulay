import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { betterAuth, BetterAuthOptions } from "better-auth/minimal";
import authConfig from "./auth.config";
import { Resend } from "resend";
import authSchema  from "./betterAuth/schema";
import { admin } from "better-auth/plugins"





export const authComponent = createClient<DataModel, typeof authSchema>( 
  components.betterAuth,
  {
    local: {
      schema: authSchema,
    },
  }
);




export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  const getResend = () => new Resend(process.env.RESEND_API_KEY || "");
  const siteUrl = process.env.SITE_URL || "http://localhost:5173";

  return {
    user: {
      modelName:"users",
      additionalFields: {
        chargilyPayCustomerId: {
          type: "string",
          required: false,
          defaultValue: null,
          input: false,
        },
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
          input: false,
        }
      }
    },
    rateLimit: {
      enabled: true,
      storage: "database",
      customRules: {
        "/send-verification-email": {
          window: 60,
          max: 2,
        },
        "/sign-in/email": {
          window: 10,
          max: 3,
        },
      },
    },
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      async sendVerificationEmail({ user, url }) {
        const resend = getResend(); // Instantiate only when called
        console.log(resend);
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>",
          to: "khodjabacheabdelmouhaimine@gmail.com", // Changed to user.email instead of hardcoded
          subject: "Verify your email",
          html: `Click <a href="${url}">here</a> to verify your email.`,
        });
      },
      sendOnSignIn: true,
      sendOnSignUp: true,
    },
    plugins: [
      crossDomain({ siteUrl }),
      convex({ authConfig }),
      
    ],
  } satisfies BetterAuthOptions;
};
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
