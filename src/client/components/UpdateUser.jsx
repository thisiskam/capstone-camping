//import stuff
import "./AllUsers.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

//the meat of the page
export default function UpdateUser() {
  const { id } = useParams();
  //state-mgmt & navigation
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [is_admin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState([])
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isTrue = true
  const isFalse = false

  

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
          console.log("FRONTEND ROW 34 from UPDATE USER expect user:", user[0]);
          setUserDetails(user[0])
          setEmail(user[0].email)
          setUsername(user[0].username)
          setIsAdmin(user[0].is_admin)
        } else {
          throw response;
        }
      } catch (error) {
        console.error(`${error.name}: ${error.message}`);
      }
    }
    fetchUserDetail();
  }, [id]);

  // event handlers
  const handleUsersNameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleIsAdminChange = (e) => {
    console.log("worked");
    setIsAdmin(e.target.value === "true");
  };

  console.log(is_admin);
  console.log(username);
  console.log(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    editUser();
  };

  const editUser = async () => {

  }
  
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
              <label htmlFor="email">EMAIL: </label>
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
              <label htmlFor="is_admin">IS_Admin: </label>
              <label htmlFor="no" className="radio-btn">
                NO
              </label>
              <input
                type="radio"
                id="no"
                name="is_admin"
                value="false"
                checked={is_admin === false}
                onChange={handleIsAdminChange}
              /><span> </span>
              <label htmlFor="yes" className="radio-btn">
                YES
              </label>
              <input
                type="radio"
                id="yes"
                name="is_admin"
                value="true"
                checked={is_admin === true}
                onChange={handleIsAdminChange}
              />
            </div>
            <br></br>
            <button className="green-btn" type="submit">
              UPDATE
            </button>
          </div>
        </form>
        <p style={{ color: "red" }}>{message}</p>
      </div>
    </>)
}


{/* <div>
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
          value={userDetail[0].username}
        ></input>
        <br></br>
        <label htmlFor="email">EMAIL: </label>
        <input
          type="text"
          id="email"
          name="email"
          style={{ color: "black" }}
          value={userDetail[0].email}
        ></input>
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
      </div>
    </div>
  )}
</div> */}