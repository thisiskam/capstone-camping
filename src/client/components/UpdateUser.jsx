//import stuff
import "./AllUsers.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

//the meat of the page
export default function UpdateUser() {
  console.log("i see dead ppl");
  const [userDetail, setUserDetail] = useState(null);
  // const [username, setUsername] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [is_admin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  // const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUserDetail() {
      try {
        const response = await fetch("http://localhost:3000/api/users/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const user = await response.json();
          console.log("FRONTEND ROW 34 from UPDATE USER expect user:", user);
          return setUserDetail(user);
        } else {
          throw response;
        }
      } catch (error) {
        console.error(`${error.name}: ${error.message}`);
      }
    }
    fetchUserDetail();
  }, [id]);

  //send the updates to the db
  // const updateUser = async () => {
  //   try {
  //     const response = await fetch(`/api/users/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         username: username || userDetail.username,
  //         email: email || userDetail.email,
  //         password: password || userDetail.password,
  //         is_admin: is_admin || userDetail.is_admin,
  //       }),
  //     });
  //     const result = await response.json();
  //     setMessage(result.message);
  //     setTimeout(() => {
  //       navigate("/allusers");
  //     }, 50);
  //     if (!response.ok) {
  //       throw result;
  //     }
  //     //   setUsername("");
  //     //   setEmail("");
  //     //   setPassword("");
  //     //   setIsAdmin("false");
  //   } catch (error) {
  //     console.error(`${error.name}: ${error.message}`);
  //   }
  // };
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

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser();
  };

  return (
    <>
      {" "}
      <div>
        {userDetail && (
          <div>
            <h2>USER</h2>
            <p>ALL FIELDS ARE REQUIRED</p>
            <br></br>
            <form onSubmit={handleSubmit} className="form"></form>
            <div>
              <label htmlFor="username">UserName: </label>
              <input
                type="text"
                id="username"
                name="username"
                style={{ color: "black" }}
                value={userDetail.username}
              ></input>
              <br></br>
              <label htmlFor="email">EMAIL: </label>
              <label htmlFor="password">PASSWORD: </label>
              <label htmlFor="is_admin">IS_Admin: </label>
            </div>
          </div>
        )}
      </div>
      {/* <div className="App1">
        {userDetail && (
          <>
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
                    value={userDetail.username}
                    onChange={handleUsersNameChange}
                    className="create-user-input"
                    required
                  />
                </div>
                <br></br>
                <div>
                  <label htmlFor="email">EMAIL: </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    style={{ color: "black" }}
                    value={userDetail.email}
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
                    value={userDetail.password}
                    onChange={handlePasswordChange}
                    className="create-user-input"
                    required
                  />
                </div>
                <br></br>
                <div>
                  <label htmlFor="is_admin">IS_Admin: </label>
                  <input
                    type="radio"
                    id="is_admin"
                    name="is_admin"
                    style={{ color: "black" }}
                    value={userDetail.is_admin}
                    onChange={handleIsAdminChange}
                    checked
                  />
                  <label htmlFor="no" className="radio-btn">
                    NO
                  </label>
                  <input type="radio" id="yes" name="is_admin" value="true" />
                  <label htmlFor="yes">YES</label>
                </div>
                <br></br>

                <br></br>
                <button className="green-btn" type="submit">
                  UPDATE
                </button>
              </div>
            </form>
            <p style={{ color: "red" }}>{message}</p>
          </>
        )}
      </div> */}
    </>
  );
}
