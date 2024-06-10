// import stuff

import { useNavigate } from "react-router-dom";
import { useState , useEffect } from "react";
import { useParams } from "react-router-dom";
import { useRef } from "react";


export default function SingleItem() {
  const [categories, setCategories] = useState([])
  const [itemCategory, setItemCategory] = useState()
  const [itemDetails, setItemDetails] = useState([])
  const [itemReviews, setItemReviews] = useState([])
  const [imagePath, setImagePath] = useState('')
  const [oneStar, setOneStar] = useState(0)
  const [twoStar, setTwoStar] = useState(0)
  const [threeStar, setThreeStar] = useState(0)
  const [fourStar, setFourStar] = useState(0)
  const [fiveStar, setFiveStar] = useState(0)
  const [average, setAverage] = useState (0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

                      //will need to be deleted later after getting the right api path
                      const [users, setUsers] = useState([])


  const sampleCategories =[
    {id:1,	name: "Backpack"},
    {id:2, name:	"Tent"},
    {id:3,	name: "Hiking Boots"},
    {id:4,	name: "Cookware"},
    {id:5,	name: "Sleeping Bag"},
    {id:6,	name: "Water Bottle"}]

  useEffect (() => {
      async function fetchItemDetails (id) {
        const response = await fetch("http://localhost:3000/api/items/" + id)
        const api = await response.json()
        setItemDetails(api.singleItem[0])
      }
      fetchItemDetails(id)
      
      async function fetchItemReviews (id) {
        const response = await fetch("http://localhost:3000/api/items/" + id + "/reviews")
        const api = await response.json()
        setItemReviews(api.getReviews)
      }
      fetchItemReviews(id)
      setCategories(sampleCategories)


                // will need to be deleted when i get the right api path
                async function fetchUsers () {
                  const response = await fetch("http://localhost:3000/api/users/")
                  const api = await response.json()
                  setUsers(api.users)
                }
                fetchUsers()
  },[])

  useEffect (() => {
    async function findCategory () {
      let res = getCategory()
      if (res.length > 0 && res[0]) {
        setItemCategory(res[0].name);
    }}
    findCategory()
  },[itemDetails])

  function getCategory() {
    return categories.filter(category => category.id === itemDetails.category_id);
  }

 
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
  useEffect (() => {
    async function setStars () {
      if (itemReviews.length !== 0) {
        console.log(itemReviews);
        if (oneStar == 0 && twoStar == 0 && threeStar == 0 && fourStar == 0 && fiveStar == 0) {
        howManyStars()
        }
      }
    }
    setStars()
  },[imagePath, itemCategory, itemDetails])

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

// useEffect (() => {
//   async function b () {
//     if (users.length !== 0) {
//     const res = getUserName(3)
//     console.log(res);
//   }}
//   b()
// },[])

function getUserName (id) {
    const res = users.find(user => user.id === id)
    return res.username
  }



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
  return (
    <>
      <div className="App">
        <div className="home-content">
          <div className="left-container" id="left-container-single-item" >
            <h5 className="item-category"><b>CATEGORY:</b>{itemCategory}</h5>
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
            <div className="average">
              <h5>REVIEW AVERAGE</h5>
              <div>
                <img src="/src/client/assets/star-icon.svg" width="30px" alt="" />
                <h4>{average}</h4>
              </div>
            </div>
          </div>
          <div className="center-container" id="center-container-single-item">
              <h2>{itemDetails.title}</h2>
              <div className="item-description">
                <h4>DESCRIPTION</h4>
                <p>{itemDetails.description}</p>
              </div>
              <div className="item-reviews">
                <h4>REVIEWS</h4>
                  {itemReviews.map((review) => {
                    return (
                      <div className="review" key={review.id}>
                        <div className="first-line-review">
                          <h6>{getUserName(review.user_id)}</h6>
                          <p>{review.rating}</p>
                          <img src="/src/client/assets/star-icon.svg" alt="star" className="star-icon-review"/>
                        </div>
                        <p className="review-p">{review.review_text}</p>
                        <div className="item-comments">
                          <h5>Comments</h5>
                          <div className="comment">
                            <h6>username</h6>
                            <p>auctor laoreet. Praesent eget tellus augue. Donec</p>
                          </div>
                        </div>
                      </div>
                    )})}
              </div>
          </div>
          <div className="right-container">
            <img src={imagePath}/>
          </div>
        </div>
      </div>
    </>
  );
}
