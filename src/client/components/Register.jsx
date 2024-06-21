// import stuff
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";

// the main page stuff
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  // const [is_admin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const registration = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
          is_admin: false,
        }),
      });
      const result = await response.json();
      setMessage(result.message);
      localStorage.setItem("token", result.token);
      navigate("/account");
      if (!response.ok) {
        throw result;
      }
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registration();
  };
  return (
    <>
      <div className="login">
        <h1>REGISTER</h1>
        <br></br>
        <form onSubmit={handleSubmit}>
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
            <div>
              <label htmlFor="username">USERNAME: </label>
              <input
                type="text"
                id="username"
                style={{ color: "black" }}
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>
            <br></br>
            <button className="green-btn" type="submit">
              REGISTER
            </button>
          </div>
        </form>
        <br />
        <br />
        <p style={{ color: "red" }}>{message}</p>
        <br />
        <br />
        <p>
          ALREADY HAVE AN ACCOUNT?{" "}
          <NavLink to="/login" className="text-link">
            LOGIN HERE
          </NavLink>
        </p>
      </div>
    </>
  );
};
export default Register;
