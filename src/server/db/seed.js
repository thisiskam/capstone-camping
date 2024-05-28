const db = require("./client");
const { createUser } = require("./users");

const users = [
  {
    name: "Emily Johnson",
    email: "emily@example.com",
    password: "securepass",
  },
  {
    name: "Liu Wei",
    email: "liu@example.com",
    password: "strongpass",
  },
  {
    name: "Isabella García",
    email: "bella@example.com",
    password: "pass1234",
  },
  {
    name: "Mohammed Ahmed",
    email: "mohammed@example.com",
    password: "mysecretpassword",
  },
  {
    name: "John Smith",
    email: "john@example.com",
    password: "password123",
  },
  // Add more user objects as needed
];

const dropTables = async () => {
  try {
    await db.query(/*sql*/ `
        DROP TABLE IF EXISTS reviews;
        DROP TABLE IF EXISTS comments;
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS items;
        DROP TABLE IF EXISTS categories;
        `);
  } catch (err) {
    throw err;
  }
};

const createTables = async () => {
  try {
    await db.query(/*sql*/ `
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) DEFAULT 'name',
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
  );
  CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
  );
  CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    category_id INTEGER REFERENCES categories(id),
    imageURL VARCHAR(1000)
  );
  CREATE TABLE reviews(
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES items(id),
    user_id INTEGER REFERENCES users(id)
  );
  CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    review_id INTEGER REFERENCES reviews(id),
    user_id INTEGER REFERENCES users(id)
  );

        `);
  } catch (err) {
    throw err;
  }
};

const insertUsers = async () => {
  try {
    for (const user of users) {
      await createUser({
        name: user.username,
        email: user.email,
        password: user.password,
      });
    }
    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error inserting seed data:", error);
  }
};

const seedDatabase = async () => {
  try {
    db.connect();
    await dropTables();
    await createTables();
    await insertUsers();
  } catch (err) {
    throw err;
  } finally {
    db.end();
  }
};

seedDatabase();
