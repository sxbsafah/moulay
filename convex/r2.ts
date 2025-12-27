import { R2, R2Callbacks } from "@convex-dev/r2";
import { components, internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import checkPermission from "../src/lib/checkPermission";
import { QueryCtx } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];

export const r2 = new R2(components.r2);


const callbacks: R2Callbacks = internal.r2;


export const { generateUploadUrl, syncMetadata, onSyncMetadata } = r2.clientApi(
  {
    callbacks,
    checkUpload: async (ctx: QueryCtx) => {
      const userId = await getAuthUserId(ctx);
      if (!userId) {
        throw new ConvexError({
          message: "Unauthorized",
          code: "unauthorized",
          details: {
            root: "User must be authenticated to upload files.",
          },
        });
      }
      const havePermission = await checkPermission(ctx, userId, "admin");
      if (!havePermission) {
        throw new ConvexError({
          message: "Forbidden",
          code: "forbidden",
          details: {
            root: "User does not have permission to upload files to this bucket.",
          },
        });
      }
    },
    onSyncMetadata: async (ctx: QueryCtx, args) => {
      const metadata = await r2.getMetadata(ctx, args.key);
      console.log(metadata && metadata.size && metadata.size > MAX_FILE_SIZE);
      if (metadata && metadata.size && metadata.size > MAX_FILE_SIZE) {
        throw new Error("File size exceeds the maximum allowed size.");
      }
      if (
        metadata &&
        metadata.contentType &&
        !ACCEPTED_IMAGE_TYPES.includes(metadata.contentType)
      ) {
        throw new Error("File type is not accepted.");
      }
    },
  },
);


export const removeImage = mutation({
  args: {
    imageKey: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError({
        code: "unauthorized",
        message: "User must be authenticated to remove product images",
        details: {
          root: "Please log in to remove product images",
        },
      });
    }
    const hasAccess = await checkPermission(ctx, userId, "admin");
    if (!hasAccess) {
      throw new ConvexError({
        code: "unauthorized",
        message: "User does not have permission to remove product images",
        details: {
          root: "You must be an admin to remove product images",
        },
      });
    }
    await r2.deleteObject(ctx, args.imageKey);
    return { success: true };
  },
})