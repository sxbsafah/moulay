import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";


const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ConvexAuthProvider client={convex}>
        <ConvexQueryCacheProvider>
          <App />
        </ConvexQueryCacheProvider>
      </ConvexAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
