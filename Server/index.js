const socketIO = require("socket.io");
const http=require("http");
const express = require("express");
const dotenv = require("dotenv");
const app = express();

const server=http.createServer(app);
const io=socketIO(server);

const connectDB = require("./config/db");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/erromiddle");
dotenv.config();
const PORT = process.env.PORT || 8000;
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send(`Running at ${PORT}...`);
});

app.use("/api/user", userRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`server at ${PORT}`);
});


io.on("connection", (socket) => {
  console.log("connected socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new Message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.user) return console.log("chatuser not defined");

    chat.user.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) {
        return;
      }
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});
