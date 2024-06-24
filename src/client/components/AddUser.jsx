//import stuff here
import { useNavigate } from "react-router-dom";
import "./AllUsers.css";
import { useState } from "react";

export default function AddItem() {
  //state-mgmt & navigation
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is_admin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  //event handlers
  const handleUsersNameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleIsAdminChange = (e) => {
    setIsAdmin(e.target.value);
  };

  const createUser = async () => {
    try {
      const response = await fetch("/api/users/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          is_admin,
        }),
      });
      const result = await response.json();
      setMessage(result.message);
      setTimeout(() => {
        navigate("/allusers");
      }, 50);
      if (!response.ok) {
        throw result;
      }
      setUsername("");
      setEmail("");
      setPassword("");
      setIsAdmin("false");
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser();
  };

  return (
    <>
      <div className="App1">
        <h2>USER</h2>
        <br></br>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-container">
            <p>ALL FIELDS ARE REQUIRED</p>
            <div>
              <label htmlFor="username">UserName: </label>
              <input
                type="text"
                id="username"
                name="username"
                style={{ color: "black" }}
                value={username}
                onChange={handleUsersNameChange}
                className="create-user-input"
                required
              />
            </div>
            <br></br>
            <div>
              <label htmoFor="email">EMAIL: </label>
              <input
                type="email"
                id="email"
                name="email"
                style={{ color: "black" }}
                value={email}
                onChange={handleEmailChange}
                className="create-user-input"
                required
              />
            </div>
            <br></br>
            <div>
              <label htmlFor="email">PASSWORD: </label>
              <input
                type="password"
                id="password"
                name="password"
                style={{ color: "black" }}
                value={password}
                onChange={handlePasswordChange}
                className="create-user-input"
                required
              />
            </div>
            <br></br>
            <div>
              <label for="is_admin">IS_Admin: </label>
              <input
                type="radio"
                id="is_admin"
                name="is_admin"
                style={{ color: "black" }}
                value={is_admin}
                onChange={handleIsAdminChange}
                checked
              />
              <label for="no" className="radio-btn">
                NO
              </label>
              <input type="radio" id="yes" name="is_admin" value="true" />
              <label for="yes">YES</label>
            </div>
            <br></br>

            <br></br>
            <button className="green-btn" type="submit">
              CREATE
            </button>
          </div>
        </form>
        <p style={{ color: "red" }}>{message}</p>
      </div>
    </>
  );
}