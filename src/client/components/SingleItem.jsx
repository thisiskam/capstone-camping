import { useState , useEffect } from "react";
import { useParams } from "react-router-dom";

export default function SingleItem() {

  // state storage
  const [categories, setCategories] = useState([])
  const [itemCategory, setItemCategory] = useState()
  const [itemDetails, setItemDetails] = useState([])
  const [itemReviews, setItemReviews] = useState([])
  const [comments, setComments] = useState([])
  const [imagePath, setImagePath] = useState('')
  const [oneStar, setOneStar] = useState(0)
  const [twoStar, setTwoStar] = useState(0)
  const [threeStar, setThreeStar] = useState(0)
  const [fourStar, setFourStar] = useState(0)
  const [fiveStar, setFiveStar] = useState(0)
  const [average, setAverage] = useState (0)
  const [reviewClicked, setReviewClicked] = useState(false)
  const [commentClicked, setCommentClicked] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [reviewInput, setReviewInput] = useState('')
  const [numInput, setNumInput] = useState('')
  const [commentInput, setCommentInput] = useState('')
  const [user, setUser] = useState(null);               
  const [users, setUsers] = useState([])
  const [commentEditable, setCommentEditable] = useState(null)
  const [editCommentText, setEditCommentText] = useState(null)
  const [reviewEditable, setReviewEditable] = useState(null)
  const [editReviewText, setEditReviewText] = useState('')
  const [itemEditable, setItemEditable] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newItemDecription, setNewItemDescription] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [editRating, setEditRating] = useState(null)


  // used for disabling buttons
  const disabled = true
  const notDisabled = false


  // gets item id from url
  const { id } = useParams()


  // gets token from local storage
  const token = localStorage.getItem('token');    


  // all the categories. will soon need to be replaced with a function to get categories from the api
  const sampleCategories =[
    {id:1,  name: "Backpack"},
    {id:2, name:  "Tent"},
    {id:3,  name: "Hiking Boots"},
    {id:4,  name: "Cookware"},
    {id:5,  name: "Sleeping Bag"},
    {id:6,  name: "Water Bottle"}]

  
    // temporary function to decode the token and exract the id from it
  function getIdFromToken (token) {
    try {
        const tokenParts = token.split('.');
        const encodedPayload = tokenParts[1];
        const decodedPayload = atob(encodedPayload);
        const payloadObject = JSON.parse(decodedPayload);
        const id = payloadObject.id;
        return id
    } catch (error) {
        console.error('Error decoding or extracting email from JWT:', error);
        return null;
    }
  }


  // uses temporary function that decodes the token and uses it to search through all users and store the logged in users info
  useEffect (() => {
     function findMe() {
      const id = getIdFromToken(token);    
      const me = users.find(user => user.id === id)
      setUser(me)
    }
    if(users) {findMe()} 
  },[users, getIdFromToken])
  
  

  // only runs on initial render
  useEffect (() => {

    // if a token exists, sets in state that the user is logged in
    token ? setIsLoggedIn(true) : setIsLoggedIn(false)

    // sets categories to temporary array
    setCategories(sampleCategories)

    // gets the single items details from the api and stores them in state
      async function fetchItemDetails (id) {
        const response = await fetch("http://localhost:3000/api/items/" + id)
        const api = await response.json()
        setItemDetails(api.singleItem[0])
      }
      fetchItemDetails(id)
      
      // gets item reviews
      async function fetchItemReviews (id) {
        const response = await fetch("http://localhost:3000/api/items/" + id + "/reviews")
        const api = await response.json()
        setItemReviews(api.getReviews)
      }
      fetchItemReviews(id)

       // fetches all users and stores them in state 
      async function fetchUsers () {
        const response = await fetch("http://localhost:3000/api/users/")
        const api = await response.json()
        setUsers(api.users)
      }
      fetchUsers()
  },[])


  // runs on initial render and when reviews are edited in state
  useEffect (() => {
    // maps over each review and gets all the comments associated with any review on the page. then stores them all in an array in state
    async function getComments() {
      const promises = itemReviews.map(async (review) => {
        const res = await fetch(`http://localhost:3000/api/items/reviews/${review.id}/comments`)
        const api = await res.json()
        return api
      })
      const results = await Promise.all(promises)
      setComments(results[0])
    }
    getComments()
  },[itemReviews])


  // returns the whole category stored in an object that matches the item.id 
  function getCategory() {
    return categories.filter(category => category.id === itemDetails.category_id);
  }


  // calls the function to find which category is associated with the item and then store the name of that category in state
  useEffect (() => {
    async function findCategory () {
      let res = getCategory()
      if (res.length > 0 && res[0]) {
        setItemCategory(res[0].name);
    }}
    findCategory()       
  },[itemDetails])


  // function that takes in a two letter key from the image name and then sets the correct path of the image based on that key
  function findImage (key) {
    if (key === "bp") {
      setImagePath("/src/client/assets/backpacks/" + itemDetails.imageurl) 
    }
    if (key === "bo") {
      setImagePath("/src/client/assets/boots/" + itemDetails.imageurl) 
    }
    if (key === "cw") {
      setImagePath("/src/client/assets/cookware/" + itemDetails.imageurl) 
    }
    if (key === "sb") {
      setImagePath("/src/client/assets/sleepingBags/" + itemDetails.imageurl) 
    }
    if (key === "te") {
      setImagePath("/src/client/assets/tents/" + itemDetails.imageurl) 
    }
    if (key === "wb") {
      setImagePath("/src/client/assets/boots/" + itemDetails.imageurl) 
    }
  }
  

  // function that takes the first two letters of the image name and then calls the set image function. basically searches for where the image should be. if its a stored image, it will find it and return the right path, if its a url it will just return the url
  useEffect (() => {
    async function setImage () {
      if (itemDetails.length !== 0) {
        setImagePath(itemDetails.imageurl)
        const key = itemDetails.imageurl.slice(0,2)
         if (key) {
          findImage(key)
        }
      }
    }
    setImage()
  },[itemDetails])

  function starCount (rating) {
    if(rating === 1 ) {
      return <img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/>
    } if(rating === 2) {
      return <><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/></>
    } if(rating === 3) {
      return <><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/></>
    } if(rating === 4) {
      return <><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/></>
    } if(rating === 5) {
      return <><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/><img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/></>
    }
  }

  // for each review, if statement that updates the state of ratings for each number rating
  function howManyStars() {
    itemReviews.forEach((review) => {
      if (review.rating === 5) {
        setFiveStar(prevCount => prevCount + 1);
    }
    if (review.rating === 4) {
        setFourStar(prevCount => prevCount + 1);
    }
    if (review.rating === 3) {
        setThreeStar(prevCount => prevCount + 1);
    }
    if (review.rating === 2) {
        setTwoStar(prevCount => prevCount + 1);
    }
    if (review.rating === 1) {
        setOneStar(prevCount => prevCount + 1);
    }
  })}


  // assigns how many 1,2,3,4 and 5 star reviews the item has respectfully
  useEffect (() => {
    async function setStars () {
      if (itemReviews.length !== 0) {
        if (oneStar == 0 && twoStar == 0 && threeStar == 0 && fourStar == 0 && fiveStar == 0) {
        howManyStars()
        }
      }
    }
    setStars()
  },[imagePath, itemCategory, itemDetails])


  // calculates the average review
  useEffect (() => {
    function reviewAverage () {
      if (itemReviews.length !== 0) {
        const sum = itemReviews.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.rating
        } , 0 )
        const average = sum / itemReviews.length
        setAverage(average)
      }
    }
    reviewAverage()
  },[itemReviews])


// will be called for each review and comment. searches through stored users and returns the username that matches the user_id for the posted review or comment
function getUserName (id) {
    const user = users.find(user => user.id === id)
    return user ? user.username : "unknown user"
  }


// submit new review
  async function submitReview (e) {
    e.preventDefault()
    console.log("got here");
    try{
      const response = await fetch("http://localhost:3000/api/items/" + id + "/reviews", {
        method: 'POST',
        body: {
          "review-text" : reviewInput,
          "rating" : numInput
        },
        headers: {
          authorization: "bearer " + token,
          'Content-Type': 'application/json'
        }
      })
      const json = await response.json()
      console.log("response", json);
      console.log("review submitted");
    } catch(error) {
      console.log(error);
    }
    setNumInput(0)
    setReviewInput("")
  }


// submit new comment
  async function submitComment (id) {
    try{
      const response = await fetch("http://localhost:3000/api/items/reviews" + id + "/comments",  {
        method: 'POST',
        body: {
          "comment-text" : commentInput
        },
        headers: {
          'Content-Type': 'application/json',
          authorization: "bearer " + token
        }
      })
      const json = await response.json()
      console.log(json);
      console.log("comment submitted");
    } catch(error) {
      console.log(error);
    }
    setCommentInput(null)
  }


  // edit exsisting review
  async function editReview (id) {

  }


  // delete existing review
  async function deleteReview (id) {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
    
    } else {
    console.log("Deletion cancelled by user");
  }

  }


  // edit existing comment
  async function editComment (id) {

  }


  // delete existing comment
  async function deleteComment (id) {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
    
    } else {
    console.log("Deletion cancelled by user");
    }
  }


  // edit the item on the page
  async function editItem (id) {
    const cat = categories.find(category => newCategory === category.name)
    const catId= cat.id
    console.log(catId);
    console.log(newTitle);
    console.log(newItemDecription);
    console.log(newImage);
  }

  // delete the item all together
  async function deleteItem (id) {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
    
    } else {
    console.log("Deletion cancelled by user");
    }
  }


  // function called for each review when that review has comments. the id passed in is the review_id. returns the html elements for the comments
  function filterComments(id) {

    // gets only comments from state that are associated with the passed in review id
    const commentsToDisplay = comments.filter(comment => comment.review_id === id)

    // for each comment this will be returned
    return commentsToDisplay.map((comment) => {return (
      <div className="comment" key={comment.id}>

        {/* gets random color for username, gets username associated with the comment using the getUserName function */}
        <h6 style={{ color: '#' + Math.floor(Math.random()*16777215).toString(16)}}>{getUserName(comment.user_id)}</h6>

        {/* when "edit comment" is clicked it stores the comments id. this checks to see if the comment had its edit button clicked. if it was it returns a form for the user to edit their comment, if not it just returns the comment tect in a p */}
        {comment.id === commentEditable ? 
          <textarea className="text-input" rows="8" placeholder={comment.comment_text} value={editCommentText} onChange={(e) => {setEditCommentText(e.target.value)}} /> 
          : 
          <p className="review-p">{comment.comment_text}</p>}

             {/* this is the button box that will show up for authorized users. waits until user is in state. then checks to see if the user is an admin, or the user that is logged in matches the user that posted the comment. if either is true, it shows an edit and a delete button for the comment */}
            {user && (user.is_admin || user.id === comment.user_id) && (
              (<div className="button_box_comments">

                  {/* ternary that returns an edit and delete button if edit hasnt been pressed already. if it has been pressed, returns a submit button for the user to submit that edit, and a cancel link for the user to cancel the edit. the delete button calls a delete function and the submit button calls an edit function for the item. the cancel updates commentEditbile in state. */}
                  {comment.id !== commentEditable ? 
                  <div>

                    {/* delete comment button */}
                    <button className="delete_button" onClick={() => {deleteComment(comment.id)}}>Delete</button>

                    {/* when this button is clicked it also resets the state for the comment edit so that it doesnt transfer over from the previous edit on another comment */}
                    <button className="edit_button" onClick={() => {setCommentEditable(comment.id); setEditCommentText(comment.comment_text)}}>Edit</button>
                  </div>
                  : 
                  <div>

                    {/* calls function to edit the comment */}
                    <button onSubmit={() => editComment(comment.id)}>submit</button>
                    <br />

                    {/* cancels the edit */}
                    <a onClick={() => {setCommentEditable(null); setEditCommentText('')}}>cancel</a>
                  </div>
                  }
              </div>))}
      </div>
    )})
  }

  // return of component
  return (
    <>
      <div className="App">
        <div className="home-content">

          {/* left container with ratings and category */}
          <div className="left-container" id="left-container-single-item" >

            {/* category */}
            <h5 className="item-category"><b>CATEGORY:  </b>

            {/* waits until categories have been set to display, && checks to see if the "edit item" button was clicked */}
              {categories.length > 0 && itemEditable ?

              // if item is editable, returns a select box for user to select a new category then updates the new category to state to be submitted later. maps over each category and assigns an option to it.
                (<select className="cat_select" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>{category.name}</option>
                ))}
                </select>) 
                : 
                (itemCategory)}</h5>
                
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
                <img src="/src/client/assets/star-icon.svg" width="30px" alt="" />
                <h2>{average}</h2>
              </div>
            </div>
          </div>

          {/* center container with all reviews, starts with the item title */}
          <div className="center-container" id="center-container-single-item">

            {/* checks to see if "edit item button was pressed" */}
              {itemEditable ?
              
              // if "edit item" is pressed returns a text area for the user to edit the item title. edit is then stored in state to be sent later. else, returns item title in h2
              <textarea className="text-input item_input_title" rows="2" value={newTitle} onChange={(e) => {setNewTitle(e.target.value)}} /> 
              : 
              <h2>{itemDetails.title}</h2>}

              {/* item description goes below */}
              <div className="item-description">

                {/* checks to see if "edit item button was pressed" */}
                {itemEditable ? 
                
                // if "edit item" is pressed returns a text area for the user to edit the item description. edit is then stored in state to be sent later. else, returns item description in p
                <textarea className="text-input item_input_description" rows="6" value={newItemDecription} onChange={(e) => {setNewItemDescription(e.target.value)}} /> 
                : 
                <p>{itemDetails.description}</p>}

                {/* waits till the user has been stored in state and then checks if user is an admin. if user is an admin. returns a button box for admin to delete and edit*/}
                {user && (user.is_admin && 
                  <div className="button-box-items">

                    {/* ternary that returns an edit and delete button if edit hasnt been pressed already. if it has been pressed, returns a submit button for the user to submit that edit, and a cancel link for the user to cancel the edit. the delete button calls a delete function and the submit button calls an edit function for the item. the cancel updates itemEditbile in state. */}
                    {!itemEditable ? 
                        <div>
                          <button className="delete_button" onClick={() => {deleteItem(itemDetails.id)}}>Delete Item</button>
                          <button className="edit_button" onClick={() => {setItemEditable(true); setNewTitle(itemDetails.title); setNewItemDescription(itemDetails.description); setNewImage(itemDetails.imageurl); setNewCategory(itemCategory)}}>Edit Item</button>
                        </div>
                        : 
                        <div>
                          <button onClick={() => editItem(itemDetails.id)}>submit</button>
                          <br />
                          <br />
                          <a className="items_a" onClick={() => {setItemEditable(false);}}>cancel</a>
                        </div>
                    }
                  </div>)}
              </div>

              {/* item reviews */}
              <div className="item-reviews">
                <h4>REVIEWS</h4>

                {/* checks to see if its a logged in user and that the button to leave a review hasnt already been clicked. returns a button that sets review clicked to true which will be checked later to return a review form. also setscommentclicked to false which doesnt allow the user to write a review and a comment at the same time */}
                {isLoggedIn && !reviewClicked &&
                      (<button onClick={() => {setReviewClicked(true), setCommentClicked(false)}}>Leave A Review</button>)
                    }

                    {/* if "leave review" button is clicked, returns a form for the user to leave a review. shows username of the logged in user in an h6 with a random color. i wrote {user && user.username} so the render waits till the user has been stored in state before it looks for a username. the number input allows you to pick a number between 1 and 5 and then stores that in state. the text area stores the new review in state to be submitted later*/}
                  {reviewClicked &&
                    <div className="review">
                      <form>
                          <div className="first-line-review">
                            <h6 style={{ color: '#' + Math.floor(Math.random()*16777215).toString(16)}}>{user && user.username}</h6>
                            <input className="num-input" type="number" min='1' max='5' value={numInput} onChange={(e) => {setNumInput(e.target.value)}}/>
                            <img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-edit"/>
                          </div>
                          <div className="text-submit">
                            <textarea className="text-input" type="textarea" rows="6" cols="50" value={reviewInput} onChange={(e) => {setReviewInput(e.target.value)}}/>
                            <br />

                            {/* button is disabled unless the user writes a review and inputs a number rating. then calls the submit review function. cancel button hides review box by changing state of setreviewclicked */}
                            <button disabled={!numInput || !reviewInput ? disabled : notDisabled} onClick={(e) => {submitReview(e)}}>submit</button>
                            <a onClick={() => {setReviewClicked(false)}}>cancel</a>
                          </div>
                      </form>
                    </div>
                  }

                  {/* maps over reviews for the item */}
                  {itemReviews.map((review) => {
                    return (
                      <div className="review" key={review.id}>
                        <div className="first-line-review">

                          {/* returns user that posted the review by calling get username function  */}
                          <h6 className="username" style={{ color: '#' + Math.floor(Math.random()*16777215).toString(16)}}>{getUserName(review.user_id)}</h6>

                          {/* reviewEditable stores the id of the review when any "edit review" button has been clicked. this ternary checks to see if an edit button was clicked and then makes the rating it was clicked for editable. if not it just returns the number rating  */}
                          {review.id === reviewEditable ? 
                              <><input className="num-input" type="number" min='1' max='5' value={editRating} onChange={(e) => {setEditRating(e.target.value)}}/>
                              <img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-edit"/></>
                              : 
                              starCount(review.rating)
                              }
                        </div>

                        {/* reviewEditable stores the id of the review when any "edit review" button has been clicked. this ternary checks to see if an edit button was clicked and then makes the review it was clicked for editable. if not it just returns the review text  */}
                        {review.id === reviewEditable ? 
                          <textarea className="text-input" rows="8" placeholder={review.review_text} value={editReviewText} onChange={(e) => {setEditReviewText(e.target.value)}} /> 
                          : 
                          <p className="review-p">{review.review_text}</p>}

                            {/* this is the button box that will show up for authorized users. waits until user is in state. then checks to see if the user is an admin, or the user that is logged in matches the user that posted the review. if either istrue, it shows an edit and a delete button for the review */}
                            {user && (user.is_admin || user.id === review.user_id) && (
                              (<div className="button_box_reviews">

                                  {/* ternary that returns an edit and delete button if edit hasnt been pressed already. if it has been pressed, returns a submit button for the user to submit that edit, and a cancel link for the user to cancel the edit. the delete button calls a delete function and the submit button calls an edit function for the item. the cancel updates reviewEditbile in state. */}
                                  {review.id !== reviewEditable ? 
                                    <div>
                                      <button className="delete_button" onClick={() => {deleteReview(review.id)}}>Delete</button>

                                      {/* when this button is clicked it also resets the state for the rating and review edit so that it doesnt transfer over from the previous edit on another review */}
                                      <button className="edit_button" onClick={() => {setReviewEditable(review.id); setEditReviewText(review.review_text); setEditRating(review.rating)}}>Edit</button>
                                    </div>
                                    : 
                                    <div>

                                      {/* submit button calls edit review function */}
                                      <button onSubmit={() => editReview(review.id)}>submit</button>
                                      <br />

                                      {/* cancel rests edited text in state */}
                                      <a onClick={() => {setReviewEditable(null); setEditReviewText('')}}>cancel</a>
                                    </div>
                                  }
                               </div>))}

                        {/* comments section */}
                        <div className="item-comments">
                          <h5>COMMENTS</h5>

                          {/* waits for comments to load in state, then checks if there are comments. if there are comments it calls a function to filter through the comments and returns comments that are associated with the specific review. else returns a p with "no comments" */}
                          {comments && comments.length > 0  ? 
                            filterComments(review.id) 
                            : 
                            (<p className="no-comment">No Comments</p>)}

                          {/* checks to see if its a logged in user and that the button to leave a comment hasnt already been clicked. returns a button that sets commentClicked to the review id which will only return a form to leave a comment for that review. also setsReviewClicked to false which doesnt allow the user to write a review and a comment at the same time */}
                          {isLoggedIn && !commentClicked &&
                            (<button onClick={() => {setCommentClicked(review.id), setReviewClicked(false)}}>Leave Comment</button>)}

                          {/* if "leave comment" button is clicked, returns a form for the user to leave a comment only for the review that matches the id that is stored in commentClicked state (or else forms would show up in every review on the page). shows username of the logged in user in an h6 with a random color. i wrote {user && user.username} so the render waits till the user has been stored in state before it looks for a username. the number input allows you to pick a number between 1 and 5 and then stores that in state. the text area stores the new review in state to be submitted later*/}
                          {commentClicked === review.id &&
                            (<div className="comment">
                              <h6 style={{ color: '#' + Math.floor(Math.random()*16777215).toString(16)}}>{user && user.username}</h6>
                              <form className="comment-form">
                                <textarea className="text-input" type="textarea" rows="4" cols="50" value={commentInput} onChange={(e) => {setCommentInput(e.target.value)}}/>

                                {/* button is disabled unless the user writes a review and inputs a number rating. then calls the submitComment function. cancel button hides comment box by changing state of setCommentClicked */}
                                <button disabled={!commentInput ? disabled : notDisabled} onClick={() => {submitComment(review.id)}}>submit</button>
                                <a onClick={() => {setCommentClicked(false)}}>cancel</a>
                              </form>
                            </div>)}
                        </div>
                      </div>
                    )})}
              </div>
          </div>

          {/* right container */}
          <div className="right-container">

            {/* item image takes item from state after it finds the right path */}
            <img src={imagePath}/>

            {/* if "edit item" is clicked it returns a inport for someone to send a new image, populates with the path of the old image */}
            {itemEditable && (<div><label>Image Url</label><input value={newImage} className="input_image" onChange={(e) => {setNewImage(e.target.value)}}></input></div>)}
          </div>
        </div>
      </div>
    </>
  );
}