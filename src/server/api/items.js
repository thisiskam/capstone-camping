const express = require("express");
const itemsRouter = express.Router();

const { fetchItems, fetchSingleItem, createItem } = require("../db/items.js");

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

module.exports = itemsRouter;
