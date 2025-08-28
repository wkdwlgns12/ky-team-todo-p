const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// 여러 Origin 허용 (Vercel + 로컬)
const allowedOrigins = [
    process.env.FRONT_ORIGIN,
    "http://localhost:5173" // Vite 개발 서버
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS: " + origin));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// MongoDB 연결
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 연결 성공"))
    .catch((err) => console.log("MongoDB 연결 실패", err));

// 메뉴 라우트 연결
const menuRoutes = require("./routes/menuRoutes");
app.use("/api/menus", menuRoutes);

// 기본 라우트
app.get("/", (req, res) => {
    res.send("Hello Express!!!!");
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
