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

  // try {
  //   const { rows } = await db.query(
  //     /*sql*/
  //     `
  //       SELECT * FROM items
  //       `
  //   );
  //   return rows;
  //   console.log(rows);
  // } catch (err) {
  //   throw err;
  // }
};

module.exports = {
  fetchItems,
};
