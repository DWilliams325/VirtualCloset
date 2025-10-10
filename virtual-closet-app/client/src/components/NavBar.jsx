import { NavLink } from "react-router-dom";
import pfwLogo from "/pfw-Logo.svg"; // logo from public folder
import "../styles/global.css";    // use your main CSS

export default function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" style={{ fontWeight: "bold" }}>
            Career Closet
          </NavLink>
        </li>
        <li>
          <NavLink to="/browse">Browse Clothing</NavLink>
        </li>
        <li>
          <NavLink to="/book">Book Appointment</NavLink>
        </li>
        <li>
          <NavLink to="/build">Build Outfit</NavLink>
        </li>
        <li>
          <NavLink to="/signin">Sign In</NavLink>
        </li>

        {/* Right-side logo */}
        <li>
          <a
            href="https://pfw.edu"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "20px",
            }}
          >
            <img
              src={pfwLogo}
              alt="PFW Logo"
              style={{
                height: "50px", 
                width: "50px",
                transition: "transform 0.2s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "rotate(30deg)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "rotate(0deg)")
              }
            />
          </a>
        </li>
      </ul>
    </nav>
  );
}
