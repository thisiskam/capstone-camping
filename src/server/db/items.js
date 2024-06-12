const db = require("./client");

const fetchItems = async () => {
  try {
    const SQL = /*sql*/ `
  SELECT * FROM items
  `;
    const response = await db.query(SQL);
    return response.rows;
  } catch (error) {
    throw error;
  }
};

const fetchSingleItem = async (item_id) => {
  try {
    const SQL =
      /*sql*/
      `
    SELECT * FROM items WHERE id = $1
    `;
    const response = await db.query(SQL, [item_id]);
    return response.rows;
  } catch (error) {
    throw error;
  }
};

const createItem = async ({ title, description, imageURL }) => {
  const SQL =
    /*sql*/
    `
  INSERT INTO items(title, description, imageURL) VALUES ($1, $2, $3) 
  RETURNING *
  `;
  const response = await db.query(SQL, [title, description, imageURL]);
  return response.rows[0];
};

const updateItem = async (itemId, newData) => {
  await db.query(
    `UPDATE items SET title = $1, description = $2, imageURL = $3 WHERE id = $4`,
    [newData.title, newData.description, newData.imageURL, itemId]
  );
  const updatedItem = await db.query(`SELECT * FROM items WHERE id = $1`, [
    itemId,
  ]);

  return updatedItem.rows[0];
};

const deleteItem = async (itemId) => {
  try {
    const reviews = await db.query(`SELECT * FROM reviews WHERE item_id = $1`, [
      itemId,
    ]);
    if (reviews.rows.length > 0) {
      throw new Error("Cannot delete item with related reviews");
    }
    const comments = await db.query(
      `SELECT * FROM comments c JOIN reviews r ON c.review_id = r.id WHERE r.item_id = $1`,
      [itemId]
    );
    if (comments.rows.length > 0) {
      throw new Error("Cannot delete item with related comments");
    }
    const itemToDelete = await db.query(
      `DELETE FROM items WHERE id = $1 RETURNING *`,
      [itemId]
    );

    if (itemToDelete.rows.length === 0) {
      throw new Error("Item not found");
    }

    return itemToDelete.rows[0];
  } catch (error) {
    throw error;
  }
};

//this is fetch review//
const fetchReviews = async (item_id) => {
  const SQL = `--sql
      SELECT * FROM reviews
      WHERE item_id = $1
      `;
  const response = await db.query(SQL, [item_id]);
  return response.rows;
  console.log("response rows", response.rows);
};

const createReview = async ({ review_text, rating, item_id, user_id }) => {
  console.log("lincoln");
  try {
    const item = await db.query(`SELECT * FROM items WHERE id = $1`, [item_id]);

    if (item.rows.length === 0) {
      throw new Error("Item does not exist");
    }

    const user = await db.query(`SELECT * FROM users WHERE id = $1`, [user_id]);
    if (user.rows.length === 0) {
      throw new Error("User does not exist");
    }

    const SQL = /*sql*/ `
  INSERT INTO reviews(review_text, rating, item_id, user_id)
  VALUES ($1, $2, $3, $4)
  RETURNING *
  `;
    const response = await db.query(SQL, [
      review_text,
      rating,
      item_id,
      user_id,
    ]);
    return response.rows[0];
  } catch (error) {
    throw error;
  }
};

const updateReview = async (reviewId, { review_text, rating }) => {
  try {
    // const { review_text, rating } = newData;
    // await db.query(
    //   `UPDATE reviews SET review_text =$1, rating = $2 WHERE id = $3`,
    //   [review_text, rating, reviewId]
    // );
    // const updatedReview = await db.query(
    //   `SELECT * FROM  reviews WHERE id = $1`,
    //   [reviewId]
    // );
    // if (updatedReview.rows.length === 0) {
    //   throw new Error("Review not found");
    // }
    // return updatedReview.rows[0];
    const SQL = `
      UPDATE reviews
      SET review_text = $1, rating = $2
      WHERE id = $3
      RETURNING *
    `;
    const response = await db.query(SQL, [review_text, rating, reviewId]);

    if (response.rows.length === 0) {
      throw new Error("Review not found");
    }

    return response.rows[0];
  } catch (error) {
    throw error;
  }
};

const deleteReview = async (reviewId) => {
  try {
    const reviewToDelete = await db.query(
      `SELECT * FROM reviews WHERE id = $1`,
      [reviewId]
    );
    if (reviewToDelete.rows.length === 0) {
      throw new Error("review not found");
    }

    await db.query(`DELETE FROM reviews WHERE id = $1`, [reviewId]);

    return reviewToDelete.rows[0];
  } catch (error) {
    throw error;
  }
};

const fetchComments = async (reviewId) => {
  try {
    console.log(`fetching comments for review ID: ${reviewId}`);
    const SQL = /*sql*/ `
    SELECT * FROM comments WHERE review_id = $1
    `;
    const response = await db.query(SQL, [reviewId]);
    console.log(`SQL Response: ${JSON.stringify(response.rows)}`);

    return response.rows;
  } catch (error) {
    console.error(`error fetching comments: ${error.message}`);
    throw error;
  }
};

module.exports = {
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
};
