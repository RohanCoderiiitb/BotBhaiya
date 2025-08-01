import React, { useState, useEffect } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const payload = {
            username,
            password
        }

        try {
            const response = await fetch("http://localhost:8000/adminlogin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.detail || "Failed to login admin");
            }
            localStorage.setItem("token", data.access_token);
            setUsername("");
            setPassword("");
            navigate("/admin");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="signup-container">
            <form className="flex max-w-md flex-col gap-6" autoComplete="off" onSubmit={handleSubmit}>
                <div className="form-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to your account</p>
                </div>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="username">Username</Label>
                    </div>
                    <TextInput
                        id="username"
                        type="text"
                        placeholder="Enter username"
                        required
                        shadow
                        addon={<FaEnvelope className="h-5 w-5 text-gray-400" />}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="off"
                    />
                </div>

                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <TextInput
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        required
                        shadow
                        addon={<FaLock className="h-5 w-5 text-gray-400" />}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="off"
                    />
                </div>
                {error && <p className="helper-text text-red-500">{error}</p>}
                <Button type="submit">Sign in</Button>
            </form>
        </div>
    );
};

export default AdminLogin;