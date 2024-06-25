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
  const [secured, setSecured] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      try {
        const apiResponse = await fetch("/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await apiResponse.json();
        setSecured(result.is_admin);
      } catch (error) {
        console.error("account me route not worky cuz", error);
      }
    }
    fetchUser();
  }, []);


  useEffect(() => {
    async function fetchUserDetail() {
      try {
        const response = await fetch("/api/users/" + id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const user = await response.json();
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
    setIsAdmin(e.target.value === "true");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editUser();
  };

  const deleteUser = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            authorization: "Bearer " + token
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const deletedUser = await response.json();
        console.log('User deleted:', deletedUser);
        navigate("/allusers")
      } catch (error) {
        console.error('Error deleting user:', error.message);
      }
    } else {
      console.log("Deletion cancelled by user");
    }
  }

  const editUser = async () => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: username,
          email: email,
          is_admin: is_admin
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      navigate("/allusers")
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  }
  
  return (
    <>
      {secured && <div className="App">
        <h2>Edit User</h2>
        <div className="home-content">
        <br></br>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-container admin-form">
            <p>ALL FIELDS ARE REQUIRED</p>
            <div>
              <label htmlFor="username">USERNAME: </label>
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
              <label htmlFor="is_admin">ADMIN: </label>
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
            <button className="red-btn" onClick={() => {deleteUser()}}>DELETE USER</button>
          </div>
        </form>
        <p style={{ color: "red" }}>{message}</p>
      </div>
      </div> }
      {!secured && <><p>Not Authorized</p></>}
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