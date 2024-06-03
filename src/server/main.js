//top level set up stuff for everything in the SERVER folder
require("dotenv").config();

const express = require("express");
const router = require("vite-express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.static("public"));

const db = require("./db/client");
db.connect();

//this is used for anything in the api directory; to use it, create a NEW "thingRouter" for said thing
const apiRouter = require("./api");
app.use("/api", apiRouter);

router.listen(app, 3000, () =>
  console.log("Server is listening on port 3000 you goodlooking person...")
);

module.exports = router;
