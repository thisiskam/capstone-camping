const db = require("./client");

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
  fetchReviews,
};
