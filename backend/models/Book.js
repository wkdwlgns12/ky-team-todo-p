const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },   // 도서명 (필수)
        author: { type: String, required: true, trim: true },  // 작가 (필수)
        description: { type: String, default: "" },            // 간단 설명
    },
    { timestamps: true } // createdAt, updatedAt 자동 생성
);

module.exports = mongoose.model("Book", bookSchema);
