// import stuff
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// the main page stuff
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
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
      <div>
        <h2>REGISTER</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">EMAIL:</label>
            <input
              type="email"
              id="email"
              style={{ color: "black" }}
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              style={{ color: "black" }}
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div>
            <label htmlFor="username">USERNAME:</label>
            <input
              type="text"
              id="username"
              style={{ color: "black" }}
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <button type="submit">REGISTER</button>
        </form>
        <br />
        <br />
        <p style={{ color: "red" }}>{message}</p>
        <br />
        <br />
        <p>
          {/* ALREADY HAVE AN ACCOUNT? <NavLink to="login">LOGIN HERE</NavLink> */}
        </p>
      </div>
    </>
  );
};
export default Register;
