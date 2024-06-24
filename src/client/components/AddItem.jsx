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
  const [newCategory, setNewCategory] = useState("")
  const [categories, setCategories] = useState([])

  const sampleCategories = [
    { id: 1, name: "Backpack" },
    { id: 2, name: "Tent" },
    { id: 3, name: "Hiking Boots" },
    { id: 4, name: "Cookware" },
    { id: 5, name: "Sleeping Bag" },
    { id: 6, name: "Water Bottle" },
  ];
  useEffect(() => {setCategories(sampleCategories)},[])

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

    const category = categories.find(category => selectedCategoryName === category.name);

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
      <div className="App1">
        <h1 className="h1">ITEM</h1>
        <br></br>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-container">
            <div>
              <label for="itemTitle">ITEM TITLE: </label>
              <input
                type="text"
                id="itemTitle"
                name="itemTitle"
                style={{ color: "black" }}
                value={title}
                onChange={handleTitleChange}
                required
              />
            </div>
            <br></br>
            <div>
              <label for="category_id">CATEGORY: </label>
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
              <label for="description">DESCRIPTION: </label>
              <textarea
                id="description"
                name="description"
                rows="20"
                style={{ color: "black" }}
                value={description}
                onChange={handleDescriptionChange}
                required
              ></textarea>
            </div>
            <br></br>
            <div>
              <label for="imageUrl">IMAGE URL: </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                style={{ color: "black" }}
                value={imageURL}
                onChange={handleImageURLChange}
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
    </>
  );
}
