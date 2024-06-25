import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

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
      console.log("FRONTEND ROW 34 from LOGIN expect token:", result.token);
      setTimeout(() => {
        navigate("/account");
      }, 500);
      // navigate("/account");
      if (!response.ok) {
        //below looks wrong - KB
        throw result;
        // console.log("this is the result", result);
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
      <form className="login-register-form"onSubmit={handleSubmit}>
        <div className="form-container">
          <div>
            <label htmlFor="email" className="email-lable">
              EMAIL:{" "}
            </label>
            <input
              type="email"
              id="email"
              style={{ color: "black" }}
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <br></br>
          <div>
            <label htmlFor="password">PASSWORD: </label>
            <input
              type="password"
              id="password"
              style={{ color: "black" }}
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <br></br>
          <button className="green-btn" type="submit">
            LOGIN
          </button>
        </div>
      </form>
      <p style={{ color: "red" }}>{message}</p>
      <p>
        DON'T HAVE AN ACCOUNT?{" "}
        <NavLink to="register" className="text-link">
          REGISTER HERE
        </NavLink>
      </p>
    </div>
  );
};

export default Login;
