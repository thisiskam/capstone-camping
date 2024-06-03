//these two lines are needed for each new major section
const express = require("express");
const usersRouter = express.Router();

const {
  createUser,
  authenticate,
  findUserByToken,
  getAllUsers,
  logout,
  getUser,
  getUserByEmail,
} = require("../db");

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
    const user = await authenticate({ email, password });
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
module.exports = usersRouter;
