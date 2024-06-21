// import stuff
import "/src/client/components/Account.css"
import Logout from "./Logout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// the main page stuff
export default function Account() {
  console.log("i see dead ppl");

  //make usre you got a token
  const token = localStorage.getItem("token");
  console.log("FRONT END ACCOUNT PAGE line 12 token", token);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [myReviews, setMyReviews] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const Navigate = useNavigate();

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
        const reviews = await apiResponse.json();
        console.log("FRONT END ACCOUNT PAGE line 46 reviews", reviews);
        return setMyReviews(reviews);
      } catch (error) {
        console.error("my reviews route no-worky cuz", error);
      }
    }
    fetchMyReviews();
  }, []);

  useEffect(() => {
    async function fetchMyComments() {
      try {
        console.log("FRONT END ACCOUNT PAGE line 37 token", token);
        const apiResponse = await fetch("/api/users/me/comments", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const comments = await apiResponse.json();
        console.log("FRONT END ACCOUNT PAGE line 67 reviews", comments);
        return setMyComments(comments);
      } catch (error) {
        console.error("my comments no-worky cuz", error);
      }
    }
    fetchMyComments();
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
    <div className="app">
      <h1 className="myaccount-title">My Account</h1>
      <div className="home-content">
        <div className="left-container user-details">
          {loggedInUser && (
            <>
                <label><b>My Username:</b></label>
                <label>{loggedInUser.username}</label>
                <br />
                <label><b>My email:</b></label>
                <label>{loggedInUser.email}</label>
                <br />
                {/* <td className="h2">{user.is_admin ? "true" : "false"}</td> */}
                <label><b>My Role:</b></label>
                <label>
                  {loggedInUser.is_admin ? "Admin" : "Non-Admin-User"}
                </label>
            </>
          )}
        </div>
        <div className="center-container account-center">
          {myReviews.length > 0 && myComments.length > 0 
          ?
            <>
              <div>
                {myReviews.length > 0 && (
                  <div>
                    <section>
                      <h2>My Reviews:</h2>
                      {myReviews && myReviews.map((review) => {
                        return (
                          <div key={review.id}>
                            <p
                              className="single-item-title"
                              onClick={() => {
                                Navigate(`/items/${review.id}`);
                              }}
                            >
                              {review.title}
                            </p>
                          </div>
                        );
                      })}
                    </section>
                  </div>
                )}
              </div>
              <div>
                {myComments.length > 0 && (
                  <div>
                    <section>
                      <h2>My Comments:</h2>
                      {myComments && myComments.map((comment) => {
                        return (
                          <div key={comment.id}>
                            <p
                              className="single-item-title"
                              onClick={() => {
                                Navigate(`/items/${comment.id}`);
                              }}
                            >
                              {comment.title}
                            </p>
                          </div>
                        );
                      })}
                    </section>
                  </div>
                )}
              </div>
            </>
            :
            <p className="no-reviews">No Comments Or Reviews Yet</p>
          }
        </div>
        <div className="right-container logout-box">
          <Logout />
        </div>
      </div>
    </div>
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
