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

module.exports = {
  fetchItems,
  fetchSingleItem,
};
