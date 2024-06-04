const express = require("express");
const itemsRouter = express.Router();

const { fetchItems } = require("../db/items.js");

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
module.exports = itemsRouter;
