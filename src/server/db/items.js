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

const createItem = async ({ title, description, imageURL, category_id }) => {
  const SQL =
    /*sql*/
    `
  INSERT INTO items(title, description, imageURL, category_id) VALUES ($1, $2, $3, $4) 
  RETURNING *
  `;
  const response = await db.query(SQL, [
    title,
    description,
    imageURL,
    category_id,
  ]);
  return response.rows[0];
};

module.exports = {
  fetchItems,
  fetchSingleItem,
  createItem,
};
