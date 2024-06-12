const express = require("express");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { findUserByToken } = require("../db");

//ignore this middleware logger
const volleyball = require("volleyball");
apiRouter.use(volleyball);

// TO BE COMPLETED - set `req.user` if possible, using token sent in the request header
apiRouter.use(async (req, res, next) => {
  console.log("req header", req.header);
  const auth = req.header.authorization;
  // const auth = req.header("Authorization"); //we get the Authorization header from the request
  console.log("auth", auth);
  if (!auth) {
    //if we did not find the Authorization header, hit the next(else{next({) and respond with you need the header
    next();
  } else if (auth.startsWith("Bearer")) {
    // if the Authorization header was found and starts with the string "Bearer"

    const token = auth.replace("Bearer ", ""); // get rid of the "Bearer " part of the string

    try {
      const myuser = await findUserByToken(token); // pass token to find user in the ../db/index.js file
      console.log("myuser", myuser);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with 'Bearer'`,
    });
  }
});

// apiRouter.use(setReqUser);

// this is where we need to put all the custom routers
const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

//this is for the items router
const itemsRouter = require("./items");
apiRouter.use("/items", itemsRouter);

// //this is the review router//
// const reviewsRouter = require("./reviews");
// apiRouter.use("/reviews", reviewsRouter);

//classic error handling stuff
apiRouter.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message || err });
});

module.exports = apiRouter;

//log out a user: USE http://localhost:3000/api/logout
// apiRouter.post("/users/logout", async (req, res, next) => {
//   console.log("in api/index.js", token);
//   try {
//     const token = req.header("Authorization").replace("Bearer ", "");
//     const id = await logout(token);
//     res.send({
//       message: "Logout successful!",
//     });
//   } catch (err) {
//     next(err);
//   }
// });
