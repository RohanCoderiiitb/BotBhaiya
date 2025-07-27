import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        const query = new URLSearchParams(window.location.search);
        const token = query.get("token");
        if(token){
            localStorage.setItem("token", token);
            console.log("Google login mounted");
            navigate("/chat");
        }else{
            console.log("Google login not mounted")
            navigate("/");
        }
    }, []);

    return <p>Logging you in....</p>
};

export default GoogleSuccess