const db = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

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

const getUser = async ({ email, password }) => {
  if (!email || !password) {
    return;
  }
  try {
    const user = await getUserByEmail(email);
    if (!user) return;
    const hashedPassword = user.password;
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordsMatch) return;
    delete user.password;
    return user;
  } catch (err) {
    throw err;
  }
};

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
  getUser,
  getUserByEmail,
};
