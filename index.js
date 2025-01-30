const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

const userRouter = require("./routes/User");
const quizRouter = require("./routes/Quiz");
const examRouter = require("./routes/Exam");
const voucherRouter = require("./routes/Voucher");

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
mongoose
  .connect(process.env.DB_CONNECTION)
  .then((aaa) => {
    //console.log(aaa.connections);
    console.log("DB connection secured!!!");
  })
  .catch((err) => console.log(err));
app.listen(port, () => console.log("app working on port " + port + "..."));

app.use("/user", userRouter);
app.use("/quiz", quizRouter);
app.use("/exam", examRouter);
app.use("/voucher", voucherRouter);
