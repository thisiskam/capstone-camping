// import stuff to import
import "./AllUsers.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTent } from "@fortawesome/free-solid-svg-icons";

export default function AllUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const [addUser, setAddUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function getAllUsers() {
      const response = await fetch("/api/users");
      const api = await response.json();
      // console.log(api.users);
      setUsers(api.users);
    }
    getAllUsers();
    token ? setIsAdmin(true) : setIsAdmin(false);
  }, []);

  // console.log("users", users);
  const usersToDisplay = users;
  // console.log("usersToDisplay", usersToDisplay);

  return (
    <div className="App1">
      <h1 className="h1">USERS</h1>
      <div className="home-content1">
        <div className="left-container1">
          {isAdmin && (
            <div className="admin-btn-box">
              <div className="admin-user-btn">
                <button
                  onClick={() => {
                    navigate("/allusers");
                  }}
                >
                  <i>
                    <FontAwesomeIcon icon={faUser} />
                  </i>
                  USERS
                </button>
              </div>
              <div className="admin-items-btn">
                <button
                  onClick={() => {
                    navigate("/adminitems");
                  }}
                >
                  <i>
                    <FontAwesomeIcon icon={faTent} />
                  </i>
                  ITEMS
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="center-container1">
          <table>
            <thead>
              <tr>
                <th className="h2">ID</th>
                <th className="h2">NAME</th>
                <th className="h2">EMAIL</th>
                <th className="h2">IS_ADMIN</th>
              </tr>
            </thead>
            <tbody>
              {usersToDisplay &&
                usersToDisplay.map((user) => {
                  return (
                    <tr key={user.id}>
                      <td className="h2">{user.id}</td>
                      <td
                        className="h2"
                        onClick={() => navigate(`/allusers/${user.id}`)}
                      >
                        {user.username}
                      </td>
                      <td className="h2">{user.email}</td>
                      <td className="h2">{user.is_admin ? "YES" : "NO"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="right-container1">
          {isAdmin === true ? (
            <div>
              <button
                className="green-btn"
                onClick={() => {
                  navigate("/allusers/adduser");
                }}
              >
                +USER
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
