const express = require("express");
const Menu = require("../models/Menu");
const router = express.Router();

/** 메뉴 등록 (단일 또는 배열) */
router.post("/", async (req, res) => {
    try {
        const payload = Array.isArray(req.body) ? req.body : [req.body];
        if (payload.length === 0) return res.status(400).json({ error: "메뉴가 없습니다(등록해 주세요)." });
        if (payload.some(m => !m.name || !m.name.trim()))
        return res.status(400).json({ error: "메뉴 이름은 필수입니다." });

        const docs = await Menu.insertMany(payload.map(m => ({ name: m.name.trim() })), { ordered: false });
        res.status(201).json(docs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/** 목록(투표수 내림차순) */
router.get("/", async (_req, res) => {
    const menus = await Menu.find().sort({ votes: -1, _id: 1 });
    res.json(menus);
});

/** 투표 +1 */
router.post("/:id/vote", async (req, res) => {
    try {
        const updated = await Menu.findByIdAndUpdate(
        req.params.id,
        { $inc: { votes: 1 } },
        { new: true }
        );
        if (!updated) return res.status(404).json({ error: "메뉴를 찾을 수 없습니다." });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/** 결과(= 전체 정렬) */
router.get("/results", async (_req, res) => {
    const results = await Menu.find().sort({ votes: -1, _id: 1 });
    res.json(results);
});

/** 1등 뽑기 (동점이면 전부 반환) */
router.get("/top", async (_req, res) => {
    const top = await Menu.find().sort({ votes: -1 }).limit(1);
    const topVotes = top[0]?.votes ?? 0;
  if (topVotes === 0) return res.json([]);      // 아직 투표 없음
    const ties = await Menu.find({ votes: topVotes }).sort({ _id: 1 });
  res.json(ties); // 동점이면 여러 개
});

module.exports = router;