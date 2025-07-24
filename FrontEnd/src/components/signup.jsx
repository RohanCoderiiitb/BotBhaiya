import React, { useState } from "react";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { HiMail, HiLockClosed, HiUser } from "react-icons/hi";
import '../App.css'

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      username,
      password,
    };

    try {
      const response = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to register user");
      }

      // Success case
      setSuccess(data.message || "User registered successfully");
      setUsername("");
      setPassword("");
      setRepeatPassword("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="flex max-w-md flex-col gap-6" onSubmit={handleSubmit}>
        <div className="form-header">
          <h1>Signup</h1>
          <p>Sign up to get started</p>
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
            addon={<HiUser className="h-5 w-5 text-gray-400" />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password2">Your password</Label>
          </div>
          <TextInput
            id="password2"
            type="password"
            required
            shadow
            placeholder="Enter password"
            addon={<HiLockClosed className="h-5 w-5 text-gray-400" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="repeat-password">Confirm password</Label>
          </div>
          <TextInput
            id="repeat-password"
            type="password"
            required
            shadow
            placeholder="Confirm password"
            addon={<HiLockClosed className="h-5 w-5 text-gray-400" />}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
        </div>
        {error && <p className="helper-text text-red-500">{error}</p>}
        {success && <p className="helper-text text-green-500">{success}</p>}
        <div className="flex items-center gap-2">
          <Checkbox id="agree" required />
          <Label htmlFor="agree" className="flex">
            I agree with the{" "}
            <a href="#" className="text-cyan-400 hover:underline ml-1">
              terms and conditions
            </a>
          </Label>
        </div>
        <Button type="submit">Sign up</Button>
      </form>
    </div>
  );
};

export default Signup;