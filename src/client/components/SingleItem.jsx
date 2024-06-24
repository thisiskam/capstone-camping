import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function SingleItem() {
  // state storage
  const [categories, setCategories] = useState([]);
  const [itemCategory, setItemCategory] = useState();
  const [itemDetails, setItemDetails] = useState([]);
  const [itemReviews, setItemReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [oneStar, setOneStar] = useState(0);
  const [twoStar, setTwoStar] = useState(0);
  const [threeStar, setThreeStar] = useState(0);
  const [fourStar, setFourStar] = useState(0);
  const [fiveStar, setFiveStar] = useState(0);
  const [average, setAverage] = useState(0);
  const [reviewClicked, setReviewClicked] = useState(false);
  const [commentClicked, setCommentClicked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reviewInput, setReviewInput] = useState("");
  const [numInput, setNumInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [commentEditable, setCommentEditable] = useState(null);
  const [editCommentText, setEditCommentText] = useState(null);
  const [reviewEditable, setReviewEditable] = useState(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [itemEditable, setItemEditable] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newItemDecription, setNewItemDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editRating, setEditRating] = useState(null);
  const [enlarged, setEnlarged] = useState(false);
  const [colors, setColors] = useState([]);
  const navigate = useNavigate();

  // used for disabling buttons
  const disabled = true;
  const notDisabled = false;

  // gets item id from url
  const { id } = useParams();

  // gets token from local storage
  const token = localStorage.getItem("token");

  // all the categories. will soon need to be replaced with a function to get categories from the api
  const sampleCategories = [
    { id: 1, name: "Backpack" },
    { id: 2, name: "Tent" },
    { id: 3, name: "Hiking Boots" },
    { id: 4, name: "Cookware" },
    { id: 5, name: "Sleeping Bag" },
    { id: 6, name: "Water Bottle" },
  ];

  // generates random color for each user
  useEffect(() => {
    if (colors.length == 0) {
      const generateColors = users.map(
        () => "#" + Math.floor(Math.random() * 16777215).toString(16)
      );
      const generateColors2 = users.map(
        () => "#" + Math.floor(Math.random() * 16777215).toString(16)
      );
      const newColors = generateColors.concat(generateColors2);
      setColors(newColors);
    }
  }, [users]);

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
        if (result.id) {
          setIsLoggedIn(true);
          setUser(result);
        } 
        console.log("not Logged In");
        
      } catch (error) {
        console.error("account me route not worky cuz", error);
      }
    }
    fetchUser();
  }, []);

  // only runs on initial render
  useEffect(() => {
    // sets categories to temporary array
    setCategories(sampleCategories);

    // gets the single items details from the api and stores them in state
    async function fetchItemDetails(id) {
      const response = await fetch("http://localhost:3000/api/items/" + id);
      const api = await response.json();
      setItemDetails(api.singleItem[0]);
    }
    fetchItemDetails(id);

    // gets item reviews
    async function fetchItemReviews(id) {
      const response = await fetch(
        "http://localhost:3000/api/items/" + id + "/reviews"
      );
      const api = await response.json();
      setItemReviews(api.getReviews);
    }
    fetchItemReviews(id);

    // fetches all users and stores them in state
    async function fetchUsers() {
      const response = await fetch("http://localhost:3000/api/users/");
      const api = await response.json();
      setUsers(api.users);
    }
    fetchUsers();
  }, []);

  // runs on initial render and when reviews are edited in state
  useEffect(() => {
    // maps over each review and gets all the comments associated with any review on the page. then stores them all in an array in state
    async function getComments() {
      const promises = itemReviews.map(async (review) => {
        const res = await fetch(
          `http://localhost:3000/api/items/reviews/${review.id}/comments`
        );
        const api = await res.json();
        return api;
      });
      const results = await Promise.all(promises);
      const flattenedResults = results.flat();
      setComments(flattenedResults);
    }
    getComments();
  }, [itemReviews, commentClicked]);

  // returns the whole category stored in an object that matches the item.id
  function getCategory() {
    return categories.filter(
      (category) => category.id === itemDetails.category_id
    );
  }

  // calls the function to find which category is associated with the item and then store the name of that category in state
  useEffect(() => {
    async function findCategory() {
      let res = getCategory();
      if (res.length > 0 && res[0]) {
        setItemCategory(res[0].name);
      }
    }
    findCategory();
  }, [itemDetails]);

  // function that takes in a two letter key from the image name and then sets the correct path of the image based on that key
  function findImage(key) {
    if (key === "bp") {
      setImagePath("/src/client/assets/backpacks/" + itemDetails.imageurl);
    }
    if (key === "bo") {
      setImagePath("/src/client/assets/boots/" + itemDetails.imageurl);
    }
    if (key === "cw") {
      setImagePath("/src/client/assets/cookware/" + itemDetails.imageurl);
    }
    if (key === "sb") {
      setImagePath("/src/client/assets/sleepingBags/" + itemDetails.imageurl);
    }
    if (key === "te") {
      setImagePath("/src/client/assets/tents/" + itemDetails.imageurl);
    }
    if (key === "wb") {
      setImagePath("/src/client/assets/boots/" + itemDetails.imageurl);
    }
  }

  // function that takes the first two letters of the image name and then calls the set image function. basically searches for where the image should be. if its a stored image, it will find it and return the right path, if its a url it will just return the url
  useEffect(() => {
    async function setImage() {
      if (itemDetails.length !== 0) {
        setImagePath(itemDetails.imageurl);
        const key = itemDetails.imageurl.slice(0, 2);
        if (key) {
          findImage(key);
        }
      }
    }
    setImage();
  }, [itemDetails]);

  function starCount(rating) {
    if (rating === 1) {
      return (
        <img
          src="/src/client/assets/star-icon.svg"
          alt="star"
          className="star-icon-review"
        />
      );
    }
    if (rating === 2) {
      return (
        <>
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
        </>
      );
    }
    if (rating === 3) {
      return (
        <>
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
        </>
      );
    }
    if (rating === 4) {
      return (
        <>
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
        </>
      );
    }
    if (rating === 5) {
      return (
        <>
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
          <img
            src="/src/client/assets/star-icon.svg"
            alt="star"
            className="star-icon-review"
          />
        </>
      );
    }
  }

  // for each review, if statement that updates the state of ratings for each number rating
  function howManyStars() {
    itemReviews.forEach((review) => {
      if (review.rating === 5) {
        setFiveStar((prevCount) => prevCount + 1);
      }
      if (review.rating === 4) {
        setFourStar((prevCount) => prevCount + 1);
      }
      if (review.rating === 3) {
        setThreeStar((prevCount) => prevCount + 1);
      }
      if (review.rating === 2) {
        setTwoStar((prevCount) => prevCount + 1);
      }
      if (review.rating === 1) {
        setOneStar((prevCount) => prevCount + 1);
      }
    });
  }

  // assigns how many 1,2,3,4 and 5 star reviews the item has respectfully
  useEffect(() => {
    async function setStars() {
      if (itemReviews.length !== 0) {
        if (
          oneStar == 0 &&
          twoStar == 0 &&
          threeStar == 0 &&
          fourStar == 0 &&
          fiveStar == 0
        ) {
          howManyStars();
        }
      }
    }
    setStars();
  }, [imagePath, itemCategory, itemDetails]);

  // calculates the average review
  useEffect(() => {
    function reviewAverage() {
      if (itemReviews.length !== 0) {
        const sum = itemReviews.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.rating;
        }, 0);
        const average = sum / itemReviews.length;
        const avRounded = average.toFixed(1);
        setAverage(avRounded);
      }
    }
    reviewAverage();
  }, [itemReviews]);

  // will be called for each review and comment. searches through stored users and returns the username that matches the user_id for the posted review or comment
  function getUserName(id) {
    const user = users.find((user) => user.id === id);
    return user ? user.username : "unknown user";
  }

  // check for comments
  function commentsQ(id) {
    const filtered = comments.filter((comment) => id === comment.review_id);
    if (filtered.length !== 0) {
      return true;
    } else {
      return false;
    }
  }

  // submit new review
  async function submitReview(e) {
    try {
      const response = await fetch(
        "http://localhost:3000/api/items/" + id + "/reviews",
        {
          method: "POST",
          headers: {
            authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            review_text: reviewInput,
            rating: numInput,
          }),
        }
      );
      const json = await response.json();
      console.log("review submitted");
    } catch (error) {
      console.log(error);
    }
    setNumInput(0);
    setReviewInput("");
    setReviewClicked(false);
  }


  // submit new comment
  async function submitComment(id) {
    event.preventDefault()
    try {
      const response = await fetch(
        "http://localhost:3000/api/items/reviews/" + id + "/comments",
        {
          method: "POST",
          body: JSON.stringify({
            comment_text: commentInput,
          }),
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
        }
      );
      const json = await response.json();
      console.log(json);
      console.log("comment submitted");
    } catch (error) {
      console.log(error);
    }
    setCommentInput(null);
    setCommentClicked(false);
  }

  // edit exsisting review
  async function editReview(id) {
    try {
      console.log("got here");
      const response = await fetch(
        `http://localhost:3000/api/items/${itemDetails.id}/reviews/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            review_text: editReviewText,
            rating: editRating,
          }),
        }
      );

      if (response.ok) {
        console.log("Review updated successfully:");
        const updatedReview = await response.json();
        setReviewEditable(false);
        setEditReviewText("");
        setEditRating(0);
        setItemReviews((prevReviews) =>
          prevReviews.map((review) =>
            review.id === id ? updatedReview : review
          )
        );
      } else {
        console.log("Failed to update review:");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      setMessage("Error updating review");
    }
  }

  // delete existing review
  async function deleteReview(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      if (confirmed) {
        try {
          const response = await fetch(
            "http://localhost:3000/api/items/" +
              itemDetails.id +
              "/reviews/" +
              id,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
              },
            }
          );
          if (response.ok) {
            console.log("Review Deleted");
            setItemReviews((prevReviews) =>
              prevReviews.filter((review) => review.id !== id)
            );
          } else {
            console.log(json);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Deletion cancelled by user");
      }
    }
  }

  // edit existing comment
  async function editComment(id, review_id) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/items/reviews/${review_id}/comments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment_text: editCommentText,
          }),
        }
      );

      if (response.ok) {
        console.log("Comment updated successfully:");
        const updatedComment = await response.json();
        setCommentEditable(false);
        setEditCommentText("");
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === id ? updatedComment : comment
          )
        );
      } else {
        console.log("Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
      setMessage("Error updating comment");
    }
  }

  // delete existing comment
  async function deleteComment(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      try {
        const response = await fetch(
          "http://localhost:3000/api/items/comments/" + id,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + token,
            },
          }
        );
        if (response.ok) {
          console.log("Comment Deleted");
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== id)
          );
        } else {
          console.log(json);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Deletion cancelled by user");
    }
  }

  // edit the item on the page
  async function editItem(id) {
    const cat = categories.find((category) => newCategory === category.name);
    const catId = cat.id;
    console.log(catId);
    console.log(newTitle);
    console.log(newItemDecription);
    console.log(newImage);
    console.log(itemDetails.id);
    try {
      const response = await fetch("http://localhost:3000/api/items/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          title: newTitle,
          description: newItemDecription,
          imageURL: newImage,
          category_id: catId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      const updatedItem = await response.json();
      setItemEditable(false);
      setItemDetails(updatedItem);
    } catch (error) {
      console.error("Error updating item:", error);
      throw error;
    }
  }

  // delete the item all together
  async function deleteItem(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:3000/api/items/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to delete item");
        }
        console.log("Item deleted successfully:");
        navigate("/");
      } catch (error) {
        console.error("Error deleting item:", error);
        throw error;
      }
    } else {
      console.log("Deletion cancelled by user");
    }
  }

  // function called for each review when that review has comments. the id passed in is the review_id. returns the html elements for the comments
  function filterComments(id) {
    // gets only comments from state that are associated with the passed in review id
    const commentsToDisplay = comments.filter(
      (comment) => comment.review_id === id
    );

    // for each comment this will be returned
    return commentsToDisplay.map((comment) => {
      return (
        <div className="comment" key={comment.id}>
          {/* gets random color for username, gets username associated with the comment using the getUserName function */}
          <h6 style={{ color: colors[comment.user_id] }}>
            {getUserName(comment.user_id)}
          </h6>

          {/* when "edit comment" is clicked it stores the comments id. this checks to see if the comment had its edit button clicked. if it was it returns a form for the user to edit their comment, if not it just returns the comment tect in a p */}
          {comment.id === commentEditable ? (
            <textarea
              className="text-input"
              rows="8"
              placeholder={comment.comment_text}
              value={editCommentText}
              onChange={(e) => {
                setEditCommentText(e.target.value);
              }}
            />
          ) : (
            <p className="review-p">{comment.comment_text}</p>
          )}

          {/* this is the button box that will show up for authorized users. waits until user is in state. then checks to see if the user is an admin, or the user that is logged in matches the user that posted the comment. if either is true, it shows an edit and a delete button for the comment */}
          {user && (user.is_admin || user.id === comment.user_id) && (
            <div className="button_box_comments">
              {/* ternary that returns an edit and delete button if edit hasnt been pressed already. if it has been pressed, returns a submit button for the user to submit that edit, and a cancel link for the user to cancel the edit. the delete button calls a delete function and the submit button calls an edit function for the item. the cancel updates commentEditbile in state. */}
              {comment.id !== commentEditable ? (
                <div>
                  {/* delete comment button */}
                  <button
                    className="delete_button"
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    DELETE
                  </button>

                  {/* when this button is clicked it also resets the state for the comment edit so that it doesnt transfer over from the previous edit on another comment */}
                  <button
                    className="edit_button"
                    onClick={() => {
                      setCommentEditable(comment.id);
                      setEditCommentText(comment.comment_text);
                    }}
                  >
                    EDIT
                  </button>
                </div>
              ) : (
                <div>
                  {/* calls function to edit the comment */}
                  <button
                    onClick={() => editComment(comment.id, comment.review_id)}
                  >
                    SUBMIT
                  </button>
                  <br />

                  {/* cancels the edit */}
                  <a
                    onClick={() => {
                      setCommentEditable(null);
                      setEditCommentText("");
                    }}
                  >
                    CANCEL
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
  }

  // return of component
  return (
    <>
      <div className="App">
        <div className="home-content">
          {/* left container with ratings and category */}
          <div className="left-container" id="left-container-single-item">
            {/* category */}
            <h5 className="item-category">
              <b>CATEGORY: </b>

              {/* waits until categories have been set to display, && checks to see if the "edit item" button was clicked */}
              {categories.length > 0 && itemEditable ? (
                // if item is editable, returns a select box for user to select a new category then updates the new category to state to be submitted later. maps over each category and assigns an option to it.
                <select
                  className="cat_select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                itemCategory
              )}
            </h5>

            {/* star box, each div is a line of stars. the amoutn of each star reviews are stored in state and then shown here */}
            <div className="review-overview">
              <div className="star-category">
                <div className="star-box">
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                </div>
                <div className="num-reviews">
                  <h6>{fiveStar}</h6>
                </div>
              </div>
              <div className="star-category">
                <div className="star-box">
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                </div>
                <div className="num-reviews">
                  <h6>{fourStar}</h6>
                </div>
              </div>
              <div className="star-category">
                <div className="star-box">
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                </div>
                <div className="num-reviews">
                  <h6>{threeStar}</h6>
                </div>
              </div>
              <div className="star-category">
                <div className="star-box">
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                </div>
                <div className="num-reviews">
                  <h6>{twoStar}</h6>
                </div>
              </div>
              <div className="star-category">
                <div className="star-box">
                  <img src="/src/client/assets/star-icon.svg" alt="" />
                </div>
                <div className="num-reviews">
                  <h6>{oneStar}</h6>
                </div>
              </div>
            </div>

            {/* review average */}
            <div className="average">
              <h5>REVIEW AVERAGE:</h5>
              <div>
                <img
                  src="/src/client/assets/star-icon.svg"
                  width="30px"
                  alt=""
                />
                <h2>{average}</h2>
              </div>
            </div>
          </div>

          {/* center container with all reviews, starts with the item title */}
          <div className="center-container" id="center-container-single-item">
            {/* checks to see if "edit item button was pressed" */}
            {itemEditable ? (
              // if "edit item" is pressed returns a text area for the user to edit the item title. edit is then stored in state to be sent later. else, returns item title in h2
              <textarea
                className="text-input item_input_title"
                rows="2"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                }}
              />
            ) : (
              <h2>{itemDetails.title}</h2>
            )}

            {/* item description goes below */}
            <div className="item-description">
              {/* checks to see if "edit item button was pressed" */}
              {itemEditable ? (
                // if "edit item" is pressed returns a text area for the user to edit the item description. edit is then stored in state to be sent later. else, returns item description in p
                <textarea
                  className="text-input item_input_description"
                  rows="6"
                  value={newItemDecription}
                  onChange={(e) => {
                    setNewItemDescription(e.target.value);
                  }}
                />
              ) : (
                <p>{itemDetails.description}</p>
              )}

              {/* waits till the user has been stored in state and then checks if user is an admin. if user is an admin. returns a button box for admin to delete and edit*/}
              {user && user.is_admin && (
                <div className="button-box-items">
                  {/* ternary that returns an edit and delete button if edit hasnt been pressed already. if it has been pressed, returns a submit button for the user to submit that edit, and a cancel link for the user to cancel the edit. the delete button calls a delete function and the submit button calls an edit function for the item. the cancel updates itemEditbile in state. */}
                  {!itemEditable ? (
                    <div>
                      <button
                        className="delete_button"
                        onClick={() => {
                          deleteItem(itemDetails.id);
                        }}
                      >
                        DELETE ITEM
                      </button>
                      <button
                        className="edit_button"
                        onClick={() => {
                          setItemEditable(true);
                          setNewTitle(itemDetails.title);
                          setNewItemDescription(itemDetails.description);
                          setNewImage(itemDetails.imageurl);
                          setNewCategory(itemCategory);
                        }}
                      >
                        EDIT ITEM
                      </button>
                    </div>
                  ) : (
                    <div>
                      <button onClick={() => editItem(itemDetails.id)}>
                        SUBMIT
                      </button>
                      <br />
                      <br />
                      <a
                        className="items_a"
                        onClick={() => {
                          setItemEditable(false);
                        }}
                      >
                        CANCEL
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* item reviews */}
            <div className="item-reviews">
              <h4>REVIEWS</h4>

              {/* checks to see if its a logged in user and that the button to leave a review hasnt already been clicked. returns a button that sets review clicked to true which will be checked later to return a review form. also setscommentclicked to false which doesnt allow the user to write a review and a comment at the same time */}
              {isLoggedIn && !reviewClicked && (
                <button
                  onClick={() => {
                    setReviewClicked(true), setCommentClicked(false);
                  }}
                >
                  LEAVE A REVIEW
                </button>
              )}

              {/* if "leave review" button is clicked, returns a form for the user to leave a review. shows username of the logged in user in an h6 with a random color. i wrote {user && user.username} so the render waits till the user has been stored in state before it looks for a username. the number input allows you to pick a number between 1 and 5 and then stores that in state. the text area stores the new review in state to be submitted later*/}
              {reviewClicked && (
                <div className="review">
                  <form>
                    <div className="first-line-review">
                      <h6 style={{ color: colors[user.id] }}>
                        {user && user.username}
                      </h6>
                      <input
                        className="num-input"
                        type="number"
                        min="1"
                        max="5"
                        value={numInput}
                        onChange={(e) => {
                          setNumInput(e.target.value);
                        }}
                      />
                      <img
                        src="/src/client/assets/star-icon.svg"
                        alt="star"
                        className="star-icon-edit"
                      />
                    </div>
                    <div className="text-submit">
                      <textarea
                        className="text-input"
                        type="textarea"
                        rows="6"
                        cols="50"
                        value={reviewInput}
                        onChange={(e) => {
                          setReviewInput(e.target.value);
                        }}
                      />
                      <br />

                      {/* button is disabled unless the user writes a review and inputs a number rating. then calls the submit review function. cancel button hides review box by changing state of setreviewclicked */}
                      <button
                        disabled={
                          !numInput || !reviewInput ? disabled : notDisabled
                        }
                        onClick={(e) => {
                          submitReview(e);
                        }}
                      >
                        SUBMIT
                      </button>
                      <a
                        onClick={() => {
                          setReviewClicked(false);
                        }}
                      >
                        CANCEL
                      </a>
                    </div>
                  </form>
                </div>
              )}

              {/* maps over reviews for the item */}
              {itemReviews.map((review) => {
                return (
                  <div className="review" key={review.id}>
                    <div className="first-line-review">
                      {/* returns user that posted the review by calling get username function  */}
                      <h6
                        className="username"
                        style={{ color: colors[review.user_id] }}
                      >
                        {getUserName(review.user_id)}
                      </h6>

                      {/* reviewEditable stores the id of the review when any "edit review" button has been clicked. this ternary checks to see if an edit button was clicked and then makes the rating it was clicked for editable. if not it just returns the number rating  */}
                      {review.id === reviewEditable ? (
                        <>
                          <input
                            className="num-input"
                            type="number"
                            min="1"
                            max="5"
                            value={editRating}
                            onChange={(e) => {
                              setEditRating(e.target.value);
                            }}
                          />
                          <img
                            src="/src/client/assets/star-icon.svg"
                            alt="star"
                            className="star-icon-edit"
                          />
                        </>
                      ) : (
                        starCount(review.rating)
                      )}
                    </div>

                    {/* reviewEditable stores the id of the review when any "edit review" button has been clicked. this ternary checks to see if an edit button was clicked and then makes the review it was clicked for editable. if not it just returns the review text  */}
                    {review.id === reviewEditable ? (
                      <textarea
                        className="text-input"
                        rows="8"
                        placeholder={review.review_text}
                        value={editReviewText}
                        onChange={(e) => {
                          setEditReviewText(e.target.value);
                        }}
                      />
                    ) : (
                      <p className="review-p">{review.review_text}</p>
                    )}

                    {/* this is the button box that will show up for authorized users. waits until user is in state. then checks to see if the user is an admin, or the user that is logged in matches the user that posted the review. if either istrue, it shows an edit and a delete button for the review */}
                    {user && (user.is_admin || user.id === review.user_id) && (
                      <div className="button_box_reviews">
                        {/* ternary that returns an edit and delete button if edit hasnt been pressed already. if it has been pressed, returns a submit button for the user to submit that edit, and a cancel link for the user to cancel the edit. the delete button calls a delete function and the submit button calls an edit function for the item. the cancel updates reviewEditbile in state. */}
                        {review.id !== reviewEditable ? (
                          <div>
                            <button
                              className="delete_button"
                              onClick={() => {
                                deleteReview(review.id);
                              }}
                            >
                              DELETE
                            </button>

                            {/* when this button is clicked it also resets the state for the rating and review edit so that it doesnt transfer over from the previous edit on another review */}
                            <button
                              className="edit_button"
                              onClick={() => {
                                setReviewEditable(review.id);
                                setEditReviewText(review.review_text);
                                setEditRating(review.rating);
                              }}
                            >
                              EDIT
                            </button>
                          </div>
                        ) : (
                          <div>
                            {/* submit button calls edit review function */}
                            <button onClick={() => editReview(review.id)}>
                              SUBMIT
                            </button>
                            <br />

                            {/* cancel rests edited text in state */}
                            <a
                              onClick={() => {
                                setReviewEditable(null);
                                setEditReviewText("");
                              }}
                            >
                              CANCEL
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* comments section */}
                    <div className="item-comments">
                      {commentsQ(review.id) === true && <h5>COMMENTS</h5>}

                      {/* waits for comments to load in state, then checks if there are comments. if there are comments it calls a function to filter through the comments and returns comments that are associated with the specific review. else returns a p with "no comments" */}
                      {comments && comments.length > 0 ? (
                        filterComments(review.id)
                      ) : (
                        <p className="no-comment">NO COMMENTS</p>
                      )}

                      {/* checks to see if its a logged in user and that the button to leave a comment hasnt already been clicked. returns a button that sets commentClicked to the review id which will only return a form to leave a comment for that review. also setsReviewClicked to false which doesnt allow the user to write a review and a comment at the same time */}
                      {isLoggedIn && !commentClicked && (
                        <button
                          onClick={() => {
                            setCommentClicked(review.id),
                              setReviewClicked(false);
                          }}
                        >
                          LEAVE A COMMENT
                        </button>
                      )}

                      {/* if "leave comment" button is clicked, returns a form for the user to leave a comment only for the review that matches the id that is stored in commentClicked state (or else forms would show up in every review on the page). shows username of the logged in user in an h6 with a random color. i wrote {user && user.username} so the render waits till the user has been stored in state before it looks for a username. the number input allows you to pick a number between 1 and 5 and then stores that in state. the text area stores the new review in state to be submitted later*/}
                      {commentClicked === review.id && (
                        <div className="comment">
                          <h6 style={{ color: colors[user.id] }}>
                            {user && user.username}
                          </h6>
                          <form className="comment-form">
                            <textarea
                              className="text-input"
                              type="textarea"
                              rows="4"
                              cols="50"
                              value={commentInput}
                              onChange={(e) => {
                                setCommentInput(e.target.value);
                              }}
                            />

                            {/* button is disabled unless the user writes a review and inputs a number rating. then calls the submitComment function. cancel button hides comment box by changing state of setCommentClicked */}
                            <button
                              disabled={!commentInput ? disabled : notDisabled}
                              onClick={() => {
                                submitComment(review.id);
                              }}
                            >
                              SUBMIT
                            </button>
                            <a
                              onClick={() => {
                                setCommentClicked(false);
                              }}
                            >
                              CANCEL
                            </a>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* right container */}
          <div className="right-container">
            {/* item image takes item from state after it finds the right path. when item is clicked it gives it a class name of enlarged and elarges on css*/}
            <img
              onClick={() => {
                !enlarged ? setEnlarged(true) : setEnlarged(false);
              }}
              className={`right-image ${enlarged && "enlarged"}`}
              src={imagePath}
            />

            {/* if "edit item" is clicked it returns a inport for someone to send a new image, populates with the path of the old image */}
            {itemEditable && (
              <div>
                <label>Image Url</label>
                <input
                  value={newImage}
                  className="input_image"
                  onChange={(e) => {
                    setNewImage(e.target.value);
                  }}
                ></input>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
