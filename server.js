const dotenv = require("dotenv");
const express = require("express");
const unless = require("express-unless");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoute = require("./Routes/userRoute");
const boardRoute = require("./Routes/boardRoute");
const listRoute = require("./Routes/listRoute");
const cardRoute = require("./Routes/cardRoute");
const invitationRoute = require("./Routes/invitationRoute");
const auth = require("./Middlewares/auth");
const socketIo = require("socket.io");

dotenv.config();

const app = express();

// app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tms-website.netlify.app",
      "https://tms-tphx.onrender.com",
    ],
    credentials: true,
  })
);
// app.use(cors({ credentials: true }));
// AUTH VERIFICATION AND UNLESS

auth.verifyToken.unless = unless;

app.use(
  auth.verifyToken.unless({
    path: [
      { url: "/user/login", method: ["POST"] },
      { url: "/user/refresh-token", method: ["POST"] },
      { url: "/user/register-by-mail", method: ["POST"] },
      { url: "/user/verify-mail", method: ["POST"] },
    ],
  })
);
//MONGODB CONNECTION

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection is succesfull!");
  })
  .catch((err) => {
    console.log(`Database connection failed!`);
    console.log(`Details : ${err}`);
  });

//ROUTES

app.use("/user", userRoute);
app.use("/board", boardRoute);
app.use("/list", listRoute);
app.use("/card", cardRoute);
app.use("/invitation", invitationRoute);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is online! Port: ${process.env.PORT}`);
});
// const io = socketIo(server, {
//   cors: {
//     origin: ["http://localhost:5173", "https://tms-website.netlify.app"],
//     credentials: true,
//   },
// });
// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Handle socket events here

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });
