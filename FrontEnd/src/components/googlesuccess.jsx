import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
    const navigate = useNavigate();
    const [loginFailed, setLoginFail] = useState(false);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const token = query.get("token");
        if (token) {
            localStorage.setItem("token", token);
            console.log("Google login mounted");
            setTimeout(()=>{
                navigate("/chat");
            }, 3000);
        } else {
            setLoginFail(true);
            setTimeout(() => {
                navigate("/userlogin");
            }, 3000);
        }
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            {loginFailed ? (
                <div style={{
                    display: "inline-block",
                    padding: "20px",
                    border: "1px solid red",
                    borderRadius: "8px",
                    backgroundColor: "#ffe6e6",
                    color: "#a00"
                }}>
                    <h2>Login Failed</h2>
                    <p>Redirecting you back to login page...</p>
                </div>
            ) : (
                <p>Logging you in...</p>
            )}
        </div>
    );
};

export default GoogleSuccess