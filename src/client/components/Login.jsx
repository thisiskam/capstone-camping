import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const login = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const result = await response.json();
      setMessage(result.message);
      localStorage.setItem("token", result.token);
      navigate("/account");
      if (!response.ok) {
        //below looks wrong - KB
        throw result;
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(`${err.name}: ${err.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="login">
      <h1>LOGIN</h1>
      <br></br>
      <form onSubmit={handleSubmit}>
        <div className="email">
          <label htmlFor="email">EMAIL:</label>
          <input
            type="email"
            id="email"
            style={{ color: "black" }}
            value={email}
            onChange={handleEmailChange}
            required
          />
          <br></br>
          <label htmlFor="password">PASSWORD:</label>
          <input
            type="password"
            id="password"
            style={{ color: "black" }}
            value={password}
            onChange={handlePasswordChange}
            required
          />

          <br></br>
          <button className="green-btn" type="submit">
            LOGIN
          </button>

          <br />
          <br />
          <p style={{ color: "red" }}>{message}</p>
          <br />
          <br />
          <p>
            DON'T HAVE AN ACCOUNT?{" "}
            <NavLink to="register">REGISTER HERE</NavLink>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
