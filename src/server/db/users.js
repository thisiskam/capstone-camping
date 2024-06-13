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

// get all users
const getAllUsers = async () => {
  try {
    const { rows } = await db.query(
      /*sql*/
      `
      SELECT *
      FROM users
    `
    );
    return rows;
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
  console.log("db.users.js user id", response.rows[0].id);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("you not authorized, yo");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  console.log("this is the token from db/users.js", token);
  return token;
};

// find user by token
const findUserByToken = async (token) => {
  let id;
  // console.log("in findUserByToken", token);
  try {
    const payload = await jwt.verify(token, JWT);
    // console.log(`payoad`, payload);
    id = payload.id;
  } catch (err) {
    const error = Error("you not authorized, yo");
    error.status = 401;
    throw error;
  }
  const SQL = `--sql
  SELECT * FROM users WHERE id = $1
  `;
  const response = await db.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error("you not authorized, yo");
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

//log out
const logout = async (token) => {
  let userToLogOut = token;
  console.log("guessing at log out, tis is token:", token);
  try {
    await jwt.verify(token, JWT);
    return;
  } catch (err) {
    const error = Error("you not authorized, yo");
    error.status = 401;
    throw error;
  }
};

// findUserByToken();
// const getUserFromToken = async (token) => {
//   try {
//     const { id } = jwt.verify(token, JWT);
//     const SQL = `--sql
//     SELECT *
//     FROM users
//     WHERE id = $1
//     `;
//     const response = await db.query(SQL, [id]);
//     return response.rows[0];
//   } catch (error) {
//     error.status = 401;
//     throw error;
//   }
// };
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

const getUserByEmail = async (email) => {
  try {
    const {
      rows: [user],
    } = await db.query(
      /*sql*/
      `
        SELECT *
        FROM users
        WHERE email=$1;`,
      [email]
    );

    if (!user) {
      return;
    }
    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUser,
  authenticate,
  findUserByToken,
  getAllUsers,
  logout,
  // getUser,
  getUserByEmail,
};
