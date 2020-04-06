const express = require("express");
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/database");
const authRouter = require("./routes/api/auth");
const userRouter = require("./routes/api/user");
const profileRouter = require("./routes/api/profile");
const postRouter = require("./routes/api/post");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("API Running");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/post", postRouter);

server.listen(PORT, () => {
  console.log(`App running on PORT ${PORT}...`);
});
