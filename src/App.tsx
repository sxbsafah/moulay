import { Routes, Route } from "react-router";
import Home from "./pages/Home.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";

const App = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
