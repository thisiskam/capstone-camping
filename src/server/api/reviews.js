const express = require("express");
const itemsRouter = express.Router();

const { fetchReviews } = require("../db/reviews.js");

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

// itemsRouter.get("/");
module.exports = itemsRouter;
