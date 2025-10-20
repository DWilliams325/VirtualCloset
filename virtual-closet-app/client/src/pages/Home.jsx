// src/pages/Home.jsx
import "../styles/mainPage.css"; // or wherever your CSS lives
import{useNavigate} from "react-router-dom";

export default function Home() {
  const navigate =useNavigate();
  return (
    <div className="career-closet">
      

      <main className="main-section">
        <h1>Professional Attire for Your Career Success</h1>
        <h3>
          Access professional clothing and accessories to help you succeed in
          interviews, career fairs, and your professional journey. Browse our
          collection online and schedule convenient appointments.
        </h3>

        <img src="/group_pic.png" alt="Career Closet Group" />

        <div className="main-buttons">
          <button id="browseBtn" onClick={() =>navigate("/browse")}>Browse Closet</button>
          <button id="aptBtn" onClick={() =>navigate("/book")}>Book Appointment</button>
        </div>
      </main>

      <footer>
        <div className="footer-content">
          <h3>
            Career Closet supporting student success through professional attire
            and career development resources. A service of the University Career
            Services Center.
          </h3>

          <h2>Quick Links</h2>
          <div className="footer-buttons">
            <button id="lowerBrowseBtn" onClick={() =>navigate("/browse")}> Browse Clothing</button>
            <button id="lowerBookBtn" onClick={() =>navigate("/book")} > Book Appointment</button>
            <button id="lowerBuildBtn"onClick={() =>navigate("/build")}  >Build Outfit</button>
          </div>
        </div>

        <p className="copyright">
          © 2025 University Career Services. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
