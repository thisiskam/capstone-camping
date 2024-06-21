//import stuff so it all works
import "./AllUsers.css";
// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function AddItem() {
  const navigate = useNavigate();
  console.log("I love arthur");
  return (
    <>
      <div className="App1">
        <h1 className="h1">ITEM</h1>
        <br></br>
        <form className="form">
          <div className="form-container">
            <div>
              <label for="itemTitle">ITEM TITLE: </label>
              <input type="text" id="itemTitle" name="itemTitle" required />
            </div>
            <br></br>
            <div>
              <label for="category">CATEGORY: </label>
              <input type="text" id="category" name="category" required />
            </div>
            <br></br>
            <div>
              <label for="description">DESCRIPTION: </label>
              <textarea
                id="description"
                name="description"
                rows="20"
                required
              ></textarea>
            </div>
            <br></br>
            <div>
              <label for="imageUrl">IMAGE URL: </label>
              <input type="url" id="imageUrl" name="imageUrl" required />
            </div>

            <br></br>
            <button className="green-btn" type="submit">
              UPDATE
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
