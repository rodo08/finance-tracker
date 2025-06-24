import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { Finance } from "../../components/FinanceTrackerLogo";

export const Auth = () => {
  return (
    <section className="container">
      <div className="auth-logo">
        <Finance />
      </div>
      <div className="grid auth-grid">
        <SignedOut>
          <SignUpButton mode="modal" />
          <SignInButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <Navigate to="/" />
        </SignedIn>
      </div>
    </section>
  );
};
