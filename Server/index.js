const express = require("express");
const dotenv = require("dotenv");
const app = express();
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
    res.send("Hello");
});

app.use("/api/user", userRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server at ${PORT}`);
})
