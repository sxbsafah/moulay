import { Routes, Route } from "react-router";
import Home from "./pages/Home.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";
import SignIn from "./pages/SignIn.tsx";
import SignUp from "./pages/SignUp.tsx";
import AppLayout from "./layouts/AppLayout.tsx";
import AuthLayout from "./layouts/AuthLayout.tsx";
import  ForgotPassword  from "@/pages/ForgetPassword.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import Products from "./pages/Products.tsx";

const App = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path="/connexion" element={<SignIn />} />
            <Route path="/inscription" element={<SignUp />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="produits" element={<Products />} />
          </Route>
        </Route>
      </Routes>
    </main>
  );
};

export default App;
