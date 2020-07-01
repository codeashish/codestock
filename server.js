const express = require("express");
const app = express();
const userRoute = require("./routes/userroute");
const mongoose = require("mongoose");
const env = require("dotenv");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
var cors = require("cors");

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
env.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Sucess"))
  .catch((e) => console.log(e));

//serve static assests if in production

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,'client','build' ,'index.html'))  });
}

const port = process.env.PORT || 8080;

//Passport Middleware
app.use(passport.initialize());
//passport config
require("./auth/passport")(passport);

app.use("/users", userRoute);

app.listen(port, () => console.log("Connect"));
