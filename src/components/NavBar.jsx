import { NavLink } from "react-router-dom";
import "./Navbar.css";
export default function Navbar() {
    return (
        <div>
            <header className="navbar">
                <NavLink to="/" className="homepage">Home</NavLink>
                <nav className="navbarLinks">
                    <NavLink to="/students">Students</NavLink>
                    <NavLink to="/rental_cars">Rental Cars</NavLink>
                    <NavLink to="/courses">Courses</NavLink>
                </nav>
            </header>
        </div>
    );
}
