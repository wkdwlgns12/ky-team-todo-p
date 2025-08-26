const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // 1. cors 불러오기
const cookieParser = require("cookie-parser");


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    process.env.FRONT_ORIGIN,   // 배포된 프론트 (Vercel)
    "http://localhost:5173",    // Vite 기본 개발 서버
    "http://localhost:3000"     // 필요 시 로컬 프론트
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
}))

app.use(express.json());
app.use(cookieParser()); // ★ 쿠키 파싱

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB 연결 성공"))
    .catch((err) => console.log("연결 실패", err));



const menuRoutes = require("./routes/menuRoutes");
app.use("/api/menus", menuRoutes);


app.get("/", (req, res) => {
    res.send("Hello Express!!!!");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`server is running ${PORT}`);
});