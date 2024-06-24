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
  getUserAccount,
  getUserReviews,
  getUserComments,
  adminCreateUser,
  updateUser,
} = require("../db");

const { isLoggedIn, isAdmin } = require("../db/users.js");

const jwt = require("jsonwebtoken");
const JWT = process.env.JWT_SECRET;

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

//--------------------------------------------------ADMIN CREATES A USER-----------------------------------------------------------
usersRouter.post("/createuser", async (req, res, next) => {
  const { username, email, password, is_admin } = req.body;

  try {
    const _user = await getUserByEmail(email);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user with that email already exists",
      });
    }

    //create user
    const newUser = await adminCreateUser({
      username,
      email,
      password,
      is_admin,
    });

    res.send({
      message: "User Created, good job yo, Admin!",
    });
    //consider showing the message on the page -KB
  } catch ({ name, message }) {
    next({ name, message });
  }
});

//r-----------------------------------------------------------REGISTER-----------------------------------------------------------
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

//------------------------------------------------LOGIN USE http://localhost:3000/api/users/login
usersRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both an email and password",
    });
  }
  try {
    const token = await authenticate({ email, password });
    console.log("BACKEND AUTHENTICATE function row 98 in api/user.js", token);
    if (token) {
      // const findUser = await findUserByToken(user);
      // return findUser;
      // .sign
      // {
      //   id: user.id,
      //   email,
      // },
      // process.env.JWT_SECRET,
      // {
      //   expiresIn: "1w",
      // }
      // ();

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

//------------------------------------------------LOGOUT -----------------------------------------------------------
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
//------------------------------------------------GET ME INFO-----------------------------------------------------------
usersRouter.get("/me", isLoggedIn, async (req, res, next) => {
  try {
    res.send(req.user);
    console.log(
      "----------------------BACKEND API users.js ROW 142 req.user",
      req.user
    );
    // const user = req.meLoggedIn;
    // console.log(
    //   "*****************BACKEND api/users.js row 190: req.user",
    //   req.meLoggedIn
    // );
    // res.send(`User loggedin: ${user.user}`);
    // console.log(
    //   "*****************BACKEND api/users.js row 192: req.user",
    //   user.user
    // );
    // const user_id = req.token;
    // const accountInfo = await getUserAccount(user_id);
    // if (!accountInfo) {
    //   return res.status(404).json({ error: "Account not found" });
    // }
    // res.status(200).json(accountInfo);
  } catch (error) {
    console.error("Error retrieving account information", error.message);
    next(error);
  }
});
//------------------------------------------------GET ME REVIEWS-----------------------------------------------------------
usersRouter.get("/me/reviews", isLoggedIn, async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const reviews = await getUserReviews(user_id);
    if (!reviews.length) {
      return res.status(404).json({ error: "no reviews found" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("error retrieving user reviews:", error.message);
    next(error);
  }
});

usersRouter.get("/me/comments", isLoggedIn, async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const comments = await getUserComments(user_id);
    if (!comments.length) {
      return res.status(404).json({ error: "no comments found" });
    }
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error retrieving user comments:", error.message);
    next(error);
  }
});

usersRouter.put("/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const { id: user_id } = req.params;
    const { username, email, is_admin } = req.body;

    const updatedUser = await updateUser(user_id, {
      username,
      email,
      is_admin,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    next(error);
  }
});

module.exports = usersRouter;

// -------------------------------------------------DUPLICATE IGNORE!!! REGISTER-----------------------------------------------------------
// usersRouter.post("/register", async (req, res, next) => {
//   const { name, email, password } = req.body;

//   try {
//     const _user = await getUserByEmail(email);

//     if (_user) {
//       next({
//         name: "UserExistsError",
//         message: "A user with that email already exists",
//       });
//     }

//     //create users
//     const user = await createUser({
//       name,
//       email,
//       password,
//     });

//     const token = jwt.sign(
//       {
//         id: user.id,
//         email,
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1w",
//       }
//     );

//     res.send({
//       message: "Sign up successful!",
//       token,
//     });
//     console.log("this is the token you want to use:", token);
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

// // call this after login
// usersRouter.get("/me", async (req, res, next) => {
//   try {
//     res.send(req.user);
//   } catch (error) {
//     next(error);
//   }
// });
