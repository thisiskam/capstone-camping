// THIS IS THE HOME PAGE

// import stuff
// import Login from "./Login";

//cr means Camp Reviews

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CR = () => {


  // state storage
  const [items, setItems] = useState([]);
  const [searchParams, setSearchParams] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);
  const [reviews, setReviews] = useState([])

  // variable to use navigate
  const navigate = useNavigate();

  // grab token
  // const token = localStorage.getItem("token");
  // console.log("FRONT END CR line 17 token", localStorage.getItem("token"));

  // function should work to fetch the loggen in user and check if they are an admin then store admin to state
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
        console.log(apiResponse);
        const result = await apiResponse.json();
        console.log(result);
        setIsAdmin(result.is_admin)
      } catch (error) {
        console.error("account me route not worky cuz", error);
      }
    }
    fetchUser();
  }, []);
  

  // function to get reviews
  useEffect (() => {
    // maps over each review and gets all the comments associated with any review on the page. then stores them all in an array in state
    async function getReviews() {
      const promises = items.map(async (item) => {
        const res = await fetch(`http://localhost:3000/api/items/${item.id}/reviews/`)
        const api = await res.json()
        return api.getReviews
      })
      const results = await Promise.all(promises)
      const flattenedResults= results.flat()
      console.log(flattenedResults);
      setReviews(flattenedResults)
    }
    getReviews()
  },[items])

  function getStars (id) {
    const itemReviews = reviews.filter((review) => review.item_id === id) 
    console.log(itemReviews);
    if (reviews.length !== 0) {
      const sum = itemReviews.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.rating
      } , 0 )
      const average = sum / itemReviews.length
      console.log(average);
    }
  }
  // fetches all items and stores them in state
  useEffect(() => {
    async function fetchItems() {
      const response = await fetch("http://localhost:3000/api/items");
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
      <img
        src="src/client/assets/pexels-bazil-elias-1351340-2612228.jpg"
        alt=""
        className="main-img"
      />
      <h1 className="main-header">LOCALLY REVIEWED CAMPING ITEMS</h1>
      <div className="home-content">

        {/* search box */}
        <div className="left-container">
          <div className="search-header">SEARCH</div>

          {/* input sets search params to imputed  */}
          <input
            type="text"
            className="search-input"
            placeholder="Hydroflask"
            onChange={(e) => {
              setSearchParams(e.target.value);
            }}
          />

          {/* returns buttons for admin only, for all item page and all users page. navigates admin to those pages */}
          {isAdmin === true ? (
            <div>
              <img
                src="src/client/assets/user-id-svgrepo-com (1).svg"
                width="30px"
                alt=""
              />
              <button
                onClick={() => {
                  navigate("/allusers");
                }}
              >
                Users
              </button>
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
                Items
              </button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="center-container">
          <h2 className="items-header">REVIEWED ITEMS</h2>

          {/* maps over each item and displayes it on the page, each item is a link that will navigate you to that item */}
          {displayedItems.map((item) => {
            return (
              <div key={item.id} className="single-item">
                <img src="src/client/assets/star-icon.svg" alt="star" />
                <p className="single-item-rating">4</p>
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
