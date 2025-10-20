import {Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";         
import Home from "./pages/Home";                   
import BrowseClothing from "./pages/BrowseClothing";
import BookAppointment from "./pages/BookAppointment";
import BuildOutfit from "./pages/BuildOutfit";
import SignIn from "./pages/SignIn";
import "./styles/global.css";                      

export default function App() {
  return (
    <>
      <NavBar />
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseClothing />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/build" element={<BuildOutfit />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </main>
    </>
  );
  
}
