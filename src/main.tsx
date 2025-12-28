import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"; 
import { authClient } from "@/lib/auth-client";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string, {
  expectAuth: true,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        <ConvexQueryCacheProvider>
          <App />
        </ConvexQueryCacheProvider>
      </ConvexBetterAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
