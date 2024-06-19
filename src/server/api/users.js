//these two lines are needed for each new major section
const express = require("express");
const usersRouter = express.Router();

const {
  createUser,
  authenticate,
  // findUserByToken,
  getAllUsers,
  logout,
  getUser,
  getUserByEmail,
  getUserAccount,
} = require("../db");

const { isLoggedIn } = require("../db/users.js");

const jwt = require("jsonwebtoken");

//get all users: USE http://localhost:3000/api/users/
usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();

    res.send({
      users,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//register api call - CONFIRMED THIS IS WORKING AS DESIGNED
usersRouter.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const _user = await getUserByEmail(email);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user with that email already exists",
      });
    }

    //create user
    const user = await createUser({
      username,
      email,
      password,
      is_admin: false,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "Sign up successful!",
      token,
    });
    //consider showing the message on the page -KB
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// call this after login
usersRouter.get("/me", async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

//log in a user: USE http://localhost:3000/api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both an email and password",
    });
  }
  try {
    console.log("oscar");
    const user = await authenticate({ email, password });
    console.log("user", user);
    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "Login successful!",
        token,
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (err) {
    next(err);
  }
  //   const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  //   console.log("this is the token you want to use:", token);
  //   return token;
});

usersRouter.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const _user = await getUserByEmail(email);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user with that email already exists",
      });
    }

    //create users
    const user = await createUser({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      {
        id: user.id,
        email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "Sign up successful!",
      token,
    });
    console.log("this is the token you want to use:", token);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//log out a user: USE http://localhost:3000/api/logout
usersRouter.post("/logout", async (req, res, next) => {
  console.log("where is the break, it is not here");

  try {
    console.log("this is blah blah blah", req.header("Authorization"));
    const token = req.header("Authorization").replace("Bearer ", "");
    const id = await logout(token);
    res.send({
      message: "Logout successful!",
    });
  } catch (err) {
    next(err);
  }
});

usersRouter.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const accountInfo = await getUserAccount(user_id);
    if (!accountInfo) {
      return res.status(404).json({ error: "Account not found" });
    }
    res.status(200).json(accountInfo);
  } catch (error) {
    console.error("Error retrieving account information", error.message);
    next(error);
  }
});

module.exports = usersRouter;
