const express = require("express");
const Menu = require("../models/Menu");
const router = express.Router();



// 목록 조회
router.get("/", async (_req, res) => {
    const menus = await Menu.find().sort({ votes: -1, _id: 1 });
    res.json(menus);
});

// 하나만 조회
router.get("/:id", async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        if (!menu) return res.status(404).json({ message: "해당 메뉴를 찾을 수 없습니다." });

        res.status(201).json({message:'1개의 메뉴가 조회 되었습니다.', menu})
    } catch (err) {
        res.status(400).json({ message: "서버 오류", error });
    }
});

// 메뉴 등록
router.post("/", async (req, res) => {
    try {
        const payload = Array.isArray(req.body) ? req.body : [req.body];
        if (payload.length === 0) return res.status(400).json({ error: "메뉴가 없습니다(등록해 주세요)." });
        if (payload.some(m => !m.name || !m.name.trim()))
            return res.status(400).json({ error: "메뉴 이름은 필수입니다." });
        
        const menu = await Menu.insertMany(payload.map(m => ({ name: m.name.trim() })), { ordered: false });

        res.status(201).json({message:'메뉴가 등록 되었습니다.', menu})

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 투표 +1
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

//투표 -1 그리고 0이하 방지
router.post("/:id/unvote", async (req, res) => {
    try {
        const updated = await Menu.findByIdAndUpdate(
            req.params.id,
            { $inc: { votes: -1 } },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "메뉴를 찾을 수 없습니다." });
        
        if(updated.votes < 0){
            updated.votes = 0;
            await updated.save();
        }
        
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//하나 수정
router.put("/:id", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !String(name).trim()) {
            return res.status(400).json({ error: "메뉴 이름은 필수입니다." });
        }

        const updated = await Menu.findByIdAndUpdate(
            req.params.id,
            { name: String(name).trim() },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ error: "메뉴를 찾을 수 없습니다." })

        res.status(201).json({message:'1개의 메뉴가 수정 되었습니다.', updated})
    } catch (err) {
        res.status(400).json({message:"서버 오류",error});
    }});

//메뉴 삭제
router.delete("/:id", async (req, res) => {
    try {
        const deleted=await Menu.findByIdAndDelete(req.params.id)
        
        if(!deleted) return res.status(404).json({message: "메뉴를 찾을 수 없습니다."})
            
            res.status(201).json({message:"메뉴가 삭제 되었습니다",deleted})
        } catch (error) {
            res.status(400).json({message:"서버 오류",error})
        }
    });

// 1등 뽑기
// router.get("/top", async (_req, res) => {
//     const top = await Menu.find().sort({ votes: -1 }).limit(1);
//     const topVotes = top[0]?.votes ?? 0;
//   if (topVotes === 0) return res.json([]);      // 아직 투표 없음
//     const ties = await Menu.find({ votes: topVotes }).sort({ _id: 1 });
//   res.json(ties); // 동점이면 여러 개
// });

module.exports = router;