// THIS IS THE HOME PAGE

// import stuff
// import Login from "./Login";

//cr means Camp Reviews

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTent } from "@fortawesome/free-solid-svg-icons";

const CR = () => {
  // state storage
  const [items, setItems] = useState([]);
  const [searchParams, setSearchParams] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [reviews, setReviews] = useState([]);

  // variable to use navigate
  const navigate = useNavigate();

  // grab token
  const token = localStorage.getItem("token");

  // function should work to fetch the loggen in user and check if they are an admin then store admin to state
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
        setIsAdmin(result.is_admin);
      } catch (error) {
        console.error("account me route not worky cuz", error);
      }
    }
    fetchUser();
  }, []);

  // function to get reviews
  useEffect(() => {
    // maps over each review and gets all the comments associated with any review on the page. then stores them all in an array in state
    async function getReviews() {
      const promises = items.map(async (item) => {
        const res = await fetch(
          `/api/items/${item.id}/reviews/`
        );
        const api = await res.json();
        return api.getReviews;
      });
      const results = await Promise.all(promises);
      const flattenedResults = results.flat();
      setReviews(flattenedResults);
    }
    getReviews();
  }, [items]);

  // function to get average reviews
  function getStars(id) {
    // gets only the reviews that match the passed in item id
    const itemReviews = reviews.filter((review) => review.item_id === id);
    let average = 0;
    if (reviews.length !== 0) {
      const sum = itemReviews.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.rating;
      }, 0);
      average = sum / itemReviews.length;
    }

    // returns num of stars for the number of review, "no reviews" if no reviews
    if (average <= 1) {
      return (
        <img
          src="/src/client/assets/star-icon.svg"
          alt="star"
          className="star-mainpage"
        />
      );
    }
    if (average <= 2) {
      return (
        <>
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
        </>
      );
    }
    if (average <= 3) {
      return (
        <>
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
        </>
      );
    }
    if (average <= 4) {
      return (
        <>
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
        </>
      );
    }
    if (average <= 5) {
      return (
        <>
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-mainpage"
          />
        </>
      );
    } else {
      return <p className="no_reviews">No Reviews</p>;
    }
  }

  // fetches all items and stores them in state
  useEffect(() => {
    async function fetchItems() {
      const response = await fetch("/api/items");
      const api = await response.json();
      setItems(api.items);
    }
    fetchItems();
  }, []);

  // diplayed items change if there are search params. only displays items that match search params
  const displayedItems = !searchParams
    ? items
    : items.filter((item) =>
        item.title.toLowerCase().includes(searchParams.toLowerCase())
      );

  return (
    <div className="App">
      {/* hero section */}
      {/* <img
        src="src/client/assets/pexels-bazil-elias-1351340-2612228.jpg"
        alt=""
        className="main-img"
      /> */}
      <h1 className="main-header">LOCALLY REVIEWED CAMPING ITEMS</h1>
      <p className="header-p">This is a website to review some of the most popular camping gear out right now. Check out what fellow campers have to say about these great items.</p>
      <div className="home-content mainpage">
        {/* search box */}
        <div className="left-container main-left">
          <div className="search-header">SEARCH</div>
          {/* input sets search params to imputed  */}
          <input
            type="text"
            className="search-input"
            placeholder="type to search"
            onChange={(e) => {
              setSearchParams(e.target.value);
            }}
          />
          {/* /* returns buttons for admin only, for all item page and all users
          page. navigates admin to those pages */}
          {isAdmin && (
            <div className="admin-btn-box">
              <p style={{ color: "#2D464C" }}>
                ADMIN CONTROLS
              </p>
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
        <div className="center-container">
          {/* <h2 className="items-header">REVIEWED ITEMS</h2> */}

          {/* maps over each item and displayes it on the page, each item is a link that will navigate you to that item */}
          {displayedItems.map((item) => {
            return (
              <div key={item.id} className="single-item">
                {/* calls function to see what the average review for the item is */}
                <div className="stars-div-main">{getStars(item.id)}</div>
                <p
                  className="single-item-title"
                  onClick={() => navigate(`/items/${item.id}`)}
                >
                  {item.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CR;
