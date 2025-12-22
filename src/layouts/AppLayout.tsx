import {

  useConvexAuth,
} from "convex/react";
import { Outlet } from "react-router";
import LoadingScreen from "../components/LoadingScreen";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const AppLayout = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip",
  );


  if (isLoading || (isAuthenticated && user === undefined)) {
    return <LoadingScreen />;
  }

  return (
    <Outlet
      context={{ isAuthenticated, user: isAuthenticated ? user : null }}
    />
  );
};

export default AppLayout;
