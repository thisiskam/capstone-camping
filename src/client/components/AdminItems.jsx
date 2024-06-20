// import stuff to import
import "./AllUsers.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function getAllItems() {
      const response = await fetch("http://localhost:3000/api/items");
      const api = await response.json();
      // console.log(api.items);
      setItems(api.items);
    }
    getAllItems();

    token ? setIsAdmin(true) : setIsAdmin(false);
  }, []);

  //   console.log("items", items);
  const itemsToDisplay = items;

  return (
    <div className="App1">
      <h1 className="h1">ITEMS</h1>
      <div className="home-content1">
        <div className="left-container1">
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
                USERS
              </button>
              <br />
              <img
                src="src/client/assets/tent-4-svgrepo-com.svg"
                width="30px"
                alt=""
              />
              <button className="selected">ITEMS</button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className="center-container1">
          <table>
            <thead>
              <tr>
                <th className="h2">ID</th>
                <th className="h2">TITLE</th>
                <th className="h2">CATEGORY</th>
                {/* <th className="h2">REVIEW Count</th> */}
              </tr>
            </thead>
            <tbody>
              {itemsToDisplay &&
                itemsToDisplay.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td className="h2">{item.id}</td>
                      <td className="h2">{item.title}</td>
                      <td className="h2">{item.category_id}</td>
                      {/* <td className="h2">{user.is_admin ? "true" : "false"}</td> */}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="right-container1">
          {isAdmin === true ? (
            <div>
              <button
                className="green-btn"
                // onClick={() => {
                //   navigate("/allusers");
                // }}
              >
                +ITEM
              </button>
              <br />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
