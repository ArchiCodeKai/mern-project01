const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport);
const cors = require("cors");

//conect to MongoDB 連接上資料庫
mongoose
  .connect("mongodb://127.0.0.1:27017/mernDB")
  .then(() => {
    console.log("Connecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);
//course route should be projected  課程的Route須被JWT保護
//if request header 內部無JWT = unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

//只有已經登入系統後的人，才能新增或是註冊課程
//Only users who have already logged into the system are allowed to add or register for courses.

// Server is running on port 8080. 後端伺服器正在port 8080運行
app.listen(8080, () => {
  console.log("The backend server is running on port 8080.");
});
