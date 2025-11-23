import React from "react";
import { Routes, Route } from "react-router-dom";
import { AppointmentProvider } from "./context/AppointmentContext";
import { OutfitProvider } from "./context/OutfitContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BrowseClothing from "./pages/BrowseClothing";
import BookAppointment from "./pages/BookAppointment";
import BuildOutfit from "./pages/BuildOutfit";
import SignIn from "./pages/SignIn";
import "./styles/global.css";

export default function App() {
  // Lift login state here
  const [loggedIn, setLoggedIn] = React.useState(() => window.localStorage.getItem("vc_loggedIn") === "true");
  const [userEmail, setUserEmail] = React.useState(() => window.localStorage.getItem("vc_userEmail") || "");

  // Sync localStorage changes
  const handleLogin = (email) => {
    setLoggedIn(true);
    setUserEmail(email);
    window.localStorage.setItem("vc_loggedIn", "true");
    window.localStorage.setItem("vc_userEmail", email);
  };

  return (
    <AppointmentProvider>
      <OutfitProvider>
        <NavBar loggedIn={loggedIn} userEmail={userEmail} />
        <main style={{ padding: "1rem" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<BrowseClothing />} />
            <Route path="/book" element={<BookAppointment userEmail={userEmail} />} />
            <Route path="/build" element={<BuildOutfit />} />
            <Route path="/signin" element={<SignIn onLogin={handleLogin} loggedIn={loggedIn} />} />
          </Routes>
        </main>
        <Footer />
      </OutfitProvider>
    </AppointmentProvider>
  );
}
