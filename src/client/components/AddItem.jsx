//import stuff so it all works
import "./AllUsers.css";
// import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AddItem() {
  const [title, setTitle] = useState("");
  const [category_id, setCategory_id] = useState(null);
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [secured, setSecured] = useState(false);

  const sampleCategories = [
    { id: 1, name: "Backpack" },
    { id: 2, name: "Tent" },
    { id: 3, name: "Hiking Boots" },
    { id: 4, name: "Cookware" },
    { id: 5, name: "Sleeping Bag" },
    { id: 6, name: "Water Bottle" },
  ];
  useEffect(() => {
    setCategories(sampleCategories);
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

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = async (e) => {
    const selectedCategoryName = e.target.value;
    console.log("Selected category name:", selectedCategoryName);

    setNewCategory(selectedCategoryName);

    if (!categories || categories.length === 0) {
      console.log("Categories are not defined or empty:", categories);
      return;
    }

    console.log("Categories array:", categories);

    const category = categories.find(
      (category) => selectedCategoryName === category.name
    );

    if (category) {
      const catId = category.id;
      console.log("Found category ID:", catId);
      setCategory_id(catId);
    } else {
      console.log("Category not found for name:", selectedCategoryName);
      setCategory_id(null);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleImageURLChange = (e) => {
    setImageURL(e.target.value);
  };

  const createItem = async () => {
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          category_id,
          description,
          imageURL,
        }),
      });
      const result = await response.json();
      setMessage(result.message);
      setTimeout(() => {
        navigate("/adminitems");
      }, 50);
      if (!response.ok) {
        throw result;
      }
      setTitle("");
      setCategory_id("");
      setDescription("");
      setImageURL("");
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createItem();
  };

  return (
    <>
      {secured && (
        <div className="App">
          <h2>ADD ITEM</h2>
          <br></br>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-container">
              <div>
                <label htmlFor="itemTitle">ITEM TITLE: </label>
                <input
                  type="text"
                  id="itemTitle"
                  name="itemTitle"
                  style={{ color: "black" }}
                  value={title}
                  onChange={handleTitleChange}
                  className="create-user-input"
                  required
                />
              </div>
              <br></br>
              <div>
                <label htmlFor="category_id">CATEGORY: </label>
                <select
                  className="cat_select"
                  value={newCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <br></br>
              <div>
                <label htmlFor="description">DESCRIPTION: </label>
                <textarea
                  id="description"
                  name="description"
                  rows="10"
                  style={{ color: "black" }}
                  value={description}
                  onChange={handleDescriptionChange}
                  className="create-user-input"
                  required
                ></textarea>
              </div>
              <br></br>
              <div>
                <label htmlFor="imageUrl">IMAGE URL: </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  style={{ color: "black" }}
                  value={imageURL}
                  onChange={handleImageURLChange}
                  className="create-user-input"
                  required
                />
              </div>

              <br></br>
              <button className="green-btn" type="submit">
                CREATE
              </button>
            </div>
          </form>
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
