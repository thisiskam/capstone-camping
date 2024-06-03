const db = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 2;
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT_SECRET;

const createUser = async ({ username, email, password, is_admin }) => {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await db.query(
      /*sql*/
      `
        INSERT INTO users(username, email, password, is_admin)
        VALUES($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
        RETURNING *`,
      [username, email, hashedPassword, is_admin]
    );

    return user;
  } catch (err) {
    throw err;
  }
};

//---------------authenticate a user
const authenticate = async ({ email, password }) => {
  const SQL = `--sql
  SELECT id, password
  FROM users
  WHERE email = $1
  `;
  const response = await db.query(SQL, [email]);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("you not authorized, yo");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  console.log("this is the token from users.js", token);
  return token;
};

// stuff below was from starter code
// const getUser = async ({ email, password }) => {
//   if (!email || !password) {
//     return;
//   }
//   try {
//     const user = await getUserByEmail(email);
//     if (!user) return;
//     const hashedPassword = user.password;
//     const passwordsMatch = await bcrypt.compare(password, hashedPassword);
//     if (!passwordsMatch) return;
//     delete user.password;
//     return user;
//   } catch (err) {
//     throw err;
//   }
// };

// const getUserByEmail = async (email) => {
//   try {
//     const {
//       rows: [user],
//     } = await db.query(
//       /*sql*/
//       `
//         SELECT *
//         FROM users
//         WHERE email=$1;`,
//       [email]
//     );

//     if (!user) {
//       return;
//     }
//     return user;
//   } catch (err) {
//     throw err;
//   }
// };

module.exports = {
  createUser,
  authenticate,
  // getUser,
  // getUserByEmail,
};
