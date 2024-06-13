const express = require("express");
const itemsRouter = express.Router();

const {
  fetchItems,
  fetchSingleItem,
  fetchReviews,
  createItem,
  updateItem,
  deleteItem,
  createReview,
  updateReview,
  deleteReview,
  fetchComments,
  createComment,
  deleteComment,
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

itemsRouter.post("/:id/reviews", async (req, res, next) => {
  try {
    const { review_text, rating } = req.body;
    console.log(req.params);
    const { id } = req.params;

    // console.log("id", req.user.id);

    const userId = req.user;
    console.log("user", userId);
    console.log("oscar");
    const newReview = await createReview({
      review_text,
      rating,
      item_id: id,
      user_id: 1,
    });
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
});

// this is not finished, the user ID is hardcoded in.

itemsRouter.put("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { review_text, rating } = req.body;

    const updatedReview = await updateReview(reviewId, {
      review_text,
      rating,
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
});

itemsRouter.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const deletedReview = await deleteReview(reviewId);

    res
      .status(200)
      .json({ message: "review deleted successfully", deletedReview });
  } catch (error) {
    next(error);
  }
});

itemsRouter.get("/reviews/:id/comments", async (req, res, next) => {
  const reviewId = req.params.id;
  console.log(`recieved request to fetch comments for review ID: ${reviewId}`);
  try {
    const comments = await fetchComments(reviewId);

    res.status(200).json(comments);
  } catch (error) {
    console.error(`error in route: ${error.message}`);
    next(error);
  }
});

itemsRouter.post("/reviews/:id/comments", async (req, res, next) => {
  try {
    const { comment_text } = req.body;
    const { id: review_id } = req.params;

    const newComment = await createComment({ comment_text, review_id });

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error.message);
    next(error);
  }
});
//route not complete, user id comes back null until authentication is fixed (req.user)

itemsRouter.delete("/comments/:id", async (req, res, next) => {
  try {
    const { id: commentId } = req.params;

    const deletedComment = await deleteComment(commentId);

    res
      .status(200)
      .json({ message: "Comment deleted successfully", deletedComment });
  } catch (error) {
    console.error("Error deleting comment:", error.message);
    next(error);
  }
});

module.exports = itemsRouter;
