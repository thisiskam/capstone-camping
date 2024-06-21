//import stuff so it all works
import "./AllUsers.css";
// import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AddItem() {
  const [title, setTitle] = useState("");
  const [category_id, setCategory_id] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory_id(e.target.value);
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

  console.log("I love arthur");
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
              <label for="category_id">CATEGORY (choose between 1-6): </label>
              <input
                type="number"
                min="1"
                max="6"
                id="category_id"
                name="category_id"
                style={{ color: "black" }}
                value={category_id}
                defaultValue="1"
                onChange={handleCategoryChange}
                required
              />
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
