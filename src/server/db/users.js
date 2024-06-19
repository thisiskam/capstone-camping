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
    console.error(err.message);
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

const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token provided on line 48 of isLoggedin");
    return res
      .status(401)
      .json({ message: "Unauthorized: not token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("line 55", req.user);
    next();
  } catch (error) {
    console.log("invalid token, line 60 isLoggedIn");
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  console.log("req.user", req.user);
  if (req.user && req.user.is_admin) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admins only" });
  }
};

//---------------authenticate a user
const authenticate = async ({ email, password, is_admin }) => {
  const SQL = `--sql
  SELECT id, password, is_admin
  FROM users
  WHERE email = $1
  `;
  const response = await db.query(SQL, [email]);
  console.log("db.users.js user id", response.rows[0].id);
  console.log(response.rows[0]);
  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("you not authorized, yo");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign(
    { id: response.rows[0].id, is_admin: response.rows[0].is_admin },
    JWT
  );
  console.log("this is the token from db/users.js", token);
  return token;
};

// find user by token
const findUserByToken = async (token) => {
  console.log("in findUserByToken function", token);
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

const getUserAccount = async (user_id) => {
  try {
    const SQL = /*sql*/ `
    SELECT id, username, email
    FROM users
    WHERE id = $1
    `;
    const response = await db.query(SQL, [user_id]);
    return response.rows[0];
  } catch (error) {
    throw error;
  }
};

const getUserReviews = async (user_id) => {
  try {
    const SQL = /*sql*/ `
    SELECT *
    FROM reviews 
    WHERE user_id = $1
    `;
    const response = await db.query(SQL, [user_id]);
    return response.rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  authenticate,
  findUserByToken,
  getAllUsers,
  logout,
  // getUser,
  getUserByEmail,
  isLoggedIn,
  isAdmin,
  getUserAccount,
  getUserReviews,
};
