import { useOutletContext } from "react-router";

type AuthContext = {
  isAuthenticated: boolean;
  user: {
    image?: string | undefined;
    email?: string | undefined;
    emailVerificationTime?: number | undefined;
    phone?: string | undefined;
    phoneVerificationTime?: number | undefined;
    isAnonymous?: boolean | undefined;
    firstname?: string | undefined;
    lastname?: string | undefined;
    role?: "user" | "admin" | undefined;
  };
};

const useAuth = () => {
  return useOutletContext<AuthContext>();
};

export default useAuth;
