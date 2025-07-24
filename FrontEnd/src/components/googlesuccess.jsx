import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
    const navigate = useNavigate();

    useEffect(()=>{
        const query = new URLSearchParams(window.location.search);
        const token = query.get("token");
        if(token){
            localStorage.setItem("token", token);
            navigate("/chat");
        }else{
            navigate("/");
        }
    }, []);
};

export default GoogleSuccess