const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const menuRoutes = require("./routes/menuRoutes");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 연결 성공"))
    .catch((err) => console.log("연결 실패", err));

app.use("/api/menus", menuRoutes);

app.listen(PORT, () => {
    console.log("server is running");
});