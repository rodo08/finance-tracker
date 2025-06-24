import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null; // o un loader/spinner
  if (!isSignedIn) return <Navigate to="/auth" replace />;

  return children;
};
