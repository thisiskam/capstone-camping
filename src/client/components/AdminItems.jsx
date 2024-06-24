// import stuff to import
import "./AllUsers.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTent } from "@fortawesome/free-solid-svg-icons";

export default function AdminItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState();
  const [isAdmin, setIsAdmin] = useState(false);
  const [secured, setSecured] = useState(false);
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);

  const sampleCategories = [
    { id: 1, name: "Backpack" },
    { id: 2, name: "Tent" },
    { id: 3, name: "Hiking Boots" },
    { id: 4, name: "Cookware" },
    { id: 5, name: "Sleeping Bag" },
    { id: 6, name: "Water Bottle" },
  ];

  function findCategory(id) {
    const cat = categories.find((category) => id === category.id)?.name;
    return cat;
  }

  useEffect(() => {
    async function getAllItems() {
      const response = await fetch("http://localhost:3000/api/items");
      const api = await response.json();
      // console.log(api.items);
      setItems(api.items);
    }
    getAllItems();
    setCategories(sampleCategories);

    // token ? setIsAdmin(true) : setIsAdmin(false);
  }, []);

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
        setSecured(result.is_admin);
      } catch (error) {
        console.error("account me route not worky cuz", error);
      }
    }
    fetchUser();
  }, [token]);

  //   console.log("items", items);
  const itemsToDisplay = items;
  return (
    <>
      {secured && (
        <div className="App1">
          <h1 className="h1">ITEMS</h1>
          <div className="home-content1">
            <div className="left-container1">
              <div className="admin-btn-box">
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
                    categories &&
                    itemsToDisplay.map((item) => {
                      return (
                        <tr key={item.id}>
                          <td className="h2">{item.id}</td>
                          <td className="h2">
                            <a
                              className="h2"
                              href=""
                              onClick={() => {
                                navigate(`/items/${item.id}`);
                              }}
                            >
                              {item.title}
                            </a>
                          </td>
                          <td className="h2">
                            {findCategory(item.category_id)}
                          </td>
                          {/* <td className="h2">{user.is_admin ? "true" : "false"}</td> */}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div className="right-container1">
              <button
                className="green-btn"
                onClick={() => {
                  navigate("/adminitems/additem");
                }}
              >
                +ITEM
              </button>
              <br />
            </div>
          </div>
        </div>
      )}
      {!secured && (
        <>
          <p>Not Authorized</p>
        </>
      )}
    </>
  );
}
