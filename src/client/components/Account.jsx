// import stuff
import Logout from "./Logout";
import { useEffect, useState } from "react";
// import { getUserAccount } from "../src/server/db/users.js";

// the main page stuff
export default function Account() {
  console.log("i see dead ppl");

  //make usre you got a token
  const token = localStorage.getItem("token");
  console.log("FRONT END ACCOUNT PAGE line 12 token", token);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        console.log("FRONT END ACCOUNT PAGE line 18 token", token);
        const apiResponse = await fetch("/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const user = await apiResponse.json();
        return setLoggedInUser(user);
      } catch (error) {
        console.error("account me route not worky cuz", error);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchMyReviews() {
      try {
        console.log("FRONT END ACCOUNT PAGE line 37 token", token);
        const apiResponse = await fetch("/api/users/me/reviews", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const user = await apiResponse.json();
        return setLoggedInUser(user);
      } catch (error) {
        console.error("account me route not worky cuz", error);
      }
    }
    fetchMyReviews();
  }, []);
  // const handleLogout = async () => {
  //   try {
  //     console.log("love coding");
  //     const response = await fetch("/api/users/logout", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (response.ok) {
  //       window.location.href = "/";
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  return (
    <>
      <div>
        {loggedInUser && (
          <div>
            <section>
              <label>My Username:</label>
              <label>{loggedInUser.username}</label>
              <br></br>
              <label>My email:</label>
              <label>{loggedInUser.email}</label>
              <br></br>
              {/* <td className="h2">{user.is_admin ? "true" : "false"}</td> */}
              <label>My Role:</label>
              <label>
                {loggedInUser.is_admin ? "Admin" : "Non-Admin-User"}
              </label>
            </section>
          </div>
        )}
      </div>
      <br></br>{" "}
      <div>
        <Logout />
      </div>
    </>
  );
}

// cut from the top because it's lame
// if (localStorage.getItem("token") === null) {
//   return (
//     <>
//       <h1>Account</h1>
//       <h2>Log in to view your account</h2>
//     </>
//   );
// }
//just a thought to use the below syntax
// const user = localStorage.getItem("user");
