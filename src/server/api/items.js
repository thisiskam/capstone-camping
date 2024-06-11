const express = require("express");
const itemsRouter = express.Router();

const {
  fetchItems,
  fetchSingleItem,
  fetchReviews,
  createItem,
  updateItem,
  deleteItem,
} = require("../db/items.js");

//this is for getting all items
itemsRouter.get("/", async (req, res, next) => {
  try {
    const items = await fetchItems();
    res.send({
      items,
    });
  } catch (error) {
    next(error);
  }
});

//this is for getting a single item
itemsRouter.get("/:id", async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const singleItem = await fetchSingleItem(itemId);
    res.send({
      singleItem,
    });
  } catch (error) {
    next(error);
  }
});

//this is for creating an item as an admin
itemsRouter.post("/", async (req, res, next) => {
  const { title, description, imageURL, category_id } = req.body;
  try {
    const newItem = await createItem({
      title,
      description,
      imageURL,
      category_id,
    });

    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
});

itemsRouter.put("/:id", async (req, res, next) => {
  const itemId = req.params.id;
  const { title, description, imageURL } = req.body;
  try {
    const updatedItem = await updateItem(itemId, {
      title,
      description,
      imageURL,
    });
    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
});

itemsRouter.delete("/:id", async (req, res, next) => {
  const itemId = req.params.id;
  try {
    const deletedItem = await deleteItem(itemId);
    if (deletedItem) {
      res
        .status(200)
        .json({ message: "Item deleted successfully", deletedItem });
    } else {
      res.status(404).json({ message: "item not found" });
    }
  } catch (error) {
    next(error);
  }
});

// this is for getting review for an item review//
itemsRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const itemId = req.params.id;
    const getReviews = await fetchReviews(itemId);
    // res.send(await fetchReviews(req.params.id));
    res.send({ getReviews });
  } catch (error) {
    next(error);
  }
});

module.exports = itemsRouter;
