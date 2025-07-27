import React from "react";
import "../App.css";
import bgImage from '../images/IIITB2.jpg';
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
    const handleUserLogin = () => {
        navigate("/userlogin");
    }
    const handleAdminLogin = () => {
        navigate("/adminlogin")
    }
    return (
        <div className="landing-container">
            <div className="overlay" />
            <img src={bgImage} alt="IIIT-B" className="background-img" />

            <div className="content">
                <h1 className="title">Bot Bhaiya</h1>
                <p className="subtitle">
                    Your friendly onboarding guide for college life. <br />
                    From finding your hostel room to understanding college lingo, we've got you covered. <br />
                    Everything a fresher needs — all in one place.
                </p>


                <div className="buttons">
                    <button className="btn user-btn" onClick={handleUserLogin}>User Login</button>
                    <button className="btn admin-btn" onClick={handleAdminLogin}>Admin Login</button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;