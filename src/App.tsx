import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Dashboard } from "./pages/dashboard";
import { Auth } from "./pages/auth";
import { FinancialRecordsProvider } from "./contexts/financialRecordContext";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
function App() {
  return (
    <Router>
      <div className="container">
        <header className="header">
          <Link to="/auth">Dashboard</Link>
          <SignedIn>
            <UserButton showName appearance={{ baseTheme: dark }} />
          </SignedIn>
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <FinancialRecordsProvider>
                <Dashboard />
              </FinancialRecordsProvider>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
