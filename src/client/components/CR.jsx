// THIS IS THE HOME PAGE

// import stuff
// import Login from "./Login";

//cr means Camp Reviews


import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";


const CR = () => {
  const [items, setItems] = useState([])
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const token = localStorage.getItem("token")

  useEffect(() => {

    async function fetchItems () {
      const response = await fetch("http://localhost:3000/api/items") 
      const api = await response.json()
      setItems(api.items)
    }
    fetchItems()

    token ? setIsAdmin(true) :setIsAdmin(false)
  }, []); 



  const displayedItems = !searchParams ? items : items.filter((item) => item.title.toLowerCase().includes(searchParams.toLowerCase()))
  return (
    <div className="App">
      <img src="src/client/assets/pexels-bazil-elias-1351340-2612228.jpg" alt="" className="main-img"/>
      <h1 className="main-header">LOCALLY REVIEWED CAMPING ITEMS</h1>
      <div className="home-content">
        <div className="left-container">
          <div className="search-header">SEARCH</div>
          <input type="text" className="search-input" placeholder="Hydroflask" onChange={(e) => {setSearchParams(e.target.value)}}/>
          {isAdmin === true ? (<div><img src="src/client/assets/user-id-svgrepo-com (1).svg" width="30px" alt="" /><button onClick={() => {navigate("/allusers")}}>Users</button><br /><img src="src/client/assets/tent-4-svgrepo-com.svg" width="30px" alt="" /><button onClick={() => {navigate("/adminitems")}}>Items</button></div>) : (<div></div>)}
        </div>
        <div className="center-container">
            <h2 className="items-header">REVIEWED ITEMS</h2>
            {displayedItems.map((item)=>{
                return (
                    <div key={item.id} className="single-item">
                        <img src="src/client/assets/star-icon.svg" alt="star" />
                        <p className="single-item-rating">4</p>
                        <p className="single-item-title" onClick={() => navigate(`/items/${item.id}`)}>{item.title}</p>
                    </div>
                )}) 
            }
        </div>
      </div>
    </div>
  );
};

export default CR;
