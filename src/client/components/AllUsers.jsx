// import stuff to import
import "./AllUsers.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AllUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("token");

  // const [searchParams, setSearchParams] = useState("");

  useEffect(() => {
    async function getAllUsers() {
      const response = await fetch("http://localhost:3000/api/users");
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
          {isAdmin === true ? (
            <div>
              <img
                src="src/client/assets/user-id-svgrepo-com (1).svg"
                width="30px"
                alt=""
              />
              <button className="selected">USERS</button>
              <br />
              <img
                src="src/client/assets/tent-4-svgrepo-com.svg"
                width="30px"
                alt=""
              />
              <button
                onClick={() => {
                  navigate("/adminitems");
                }}
              >
                ITEMS
              </button>
            </div>
          ) : (
            <div></div>
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
                      <td className="h2">{user.username}</td>
                      <td className="h2">{user.email}</td>
                      <td className="h2">{user.is_admin ? "true" : "false"}</td>
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
                // onClick={() => {
                //   navigate("/allusers");
                // }}
              >
                +USER
              </button>
              <br />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
