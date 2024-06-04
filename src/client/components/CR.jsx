// THIS IS THE HOME PAGE

// import stuff
// import Login from "./Login";

//cr means Camp Reviews


import { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";


const CR = () => {
  const [items, setItems] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const sampleItems = [
      {rating:5.0, title:"camping item 1", id:1},
      {rating:4.0, title:"camping item 2" , id:2},
      {rating:3.2, title:"camping item 3", id:3},
      {rating:4.0, title:"camping item 4", id:4},
      {rating:2.0, title:"camping item 5", id:5},
      {rating:4.0, title:"camping item 6", id:6},
      {rating:1.0, title:"camping item 7", id:7},
      {rating:2.0, title:"camping item 8", id:8},
      {rating:3.0, title:"camping item 9", id:9},
      {rating:1.4, title:"camping item 10", id:10},
      {rating:2.6, title:"camping item 11", id:11},
      {rating:4.3, title:"camping item 12", id:12},
      {rating:4.2, title:"camping item 13", id:13}  
    ];

    setItems(sampleItems);
  }, []); 

  return (
    <div className="App">
      <img src="src/client/assets/pexels-bazil-elias-1351340-2612228.jpg" alt="" className="main-img"/>
      <h1 className="main-header">this will be a camp review site</h1>
      <div className="home-content">
        <div class="left-container">
          <div class="search-header">Search</div>
          <input type="text" class="search-input" placeholder="Enter your search query"/>
          <button class="search-button">Search</button>
        </div>
        <div className="center-container">
            <h2 className="items-header">Item Name</h2>
            {items.map((item)=>{
                return (
                    <div key={item.id} className="single-item">
                        <img src="src/client/assets/star-icon.svg" alt="star" />
                        <p className="single-item-rating">{item.rating.toFixed(1)}</p>
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
