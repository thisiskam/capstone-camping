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

module.exports = {
  fetchItems,
  fetchSingleItem,
  createItem,
  fetchReviews,
  updateItem,
  deleteItem,
};
