import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./css/PostForm.css";   // 같은 폴더에 CSS 파일 필요

// 로컬에 영구 저장되는 deviceId 생성/보관
function ensureDeviceId() {
    const key = "deviceId";
    let id = localStorage.getItem(key);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(key, id);
    }
    return id;
}

export default function PostForm() {
    const API = import.meta.env.VITE_API_URL; // e.g. http://localhost:3000/api
    const deviceId = useMemo(() => ensureDeviceId(), []);
    const [list, setList] = useState([]);
    const [mine, setMine] = useState([]);
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [q, setQ] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const fetchAll = async () => {
        setLoading(true);
        setErr("");
        try {
            const qs = new URLSearchParams();
            qs.set("deviceId", deviceId);
            if (q) qs.set("q", q);
            if (tag) qs.set("tag", tag);

            const [pubRes, mineRes] = await Promise.all([
                axios.get(`${API}/options?${qs.toString()}`),
                axios.get(`${API}/options/mine`, { params: { deviceId } }),
            ]);

            setList(pubRes.data || []);
            setMine(mineRes.data || []);
        } catch (e) {
            setErr("목록 불러오기 실패");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onCreate = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        try {
            await axios.post(`${API}/options`, { title: title.trim(), tag: tag.trim(), deviceId });
            setTitle("");
            setTag("");
            fetchAll();
        } catch (e) {
            setErr("생성 실패");
            console.error(e);
        }
    };

    const onToggleVote = async (optionId) => {
        try {
            await axios.post(`${API}/votes/toggle`, { optionId, deviceId });
            fetchAll();
        } catch (e) {
            setErr("투표 토글 실패");
            console.error(e);
        }
    };

    const onDelete = async (id) => {
        if (!confirm("삭제하시겠습니까?")) return;
        try {
            await axios.delete(`${API}/options/${id}`, { params: { deviceId } });
            fetchAll();
        } catch (e) {
            setErr("삭제 실패(본인 생성 항목만 삭제 가능)");
            console.error(e);
        }
    };

    const onUpdate = async (id) => {
        const newTitle = prompt("새 제목(메뉴명):");
        if (newTitle === null) return;
        try {
            await axios.put(`${API}/options/${id}`, { title: newTitle.trim(), deviceId });
            fetchAll();
        } catch (e) {
            setErr("수정 실패(본인 생성 항목만 수정 가능)");
            console.error(e);
        }
    };

    const onSearch = (e) => {
        e.preventDefault();
        fetchAll();
    };

    return (
        <div className="post-wrap">
            <h2>🍱 점심메뉴 익명 투표</h2>
            <p>체크 = <b>내가 선택</b> / 공개 목록은 전체 투표수 집계</p>

            <form className="post-controls" onSubmit={onCreate}>
                <input
                    placeholder="메뉴 입력 (예: 김치찌개)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    placeholder="태그 (예: 한식/분식/중식/일식...)"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />
                <button className="create btn" type="submit">추가</button>
            </form>

            <form className="post-controls" onSubmit={onSearch}>
                <input
                    placeholder="검색어(q)"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                />
                <input
                    placeholder="태그 필터(tag)"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                />
                <button className="btn">검색/필터 적용</button>
            </form>

            {loading && <p>로딩 중…</p>}
            {err && <p style={{ color: "crimson" }}>{err}</p>}

            <h3>공개 목록(전체 투표수)</h3>
            <ul className="post-list">
                {list.map((it) => (
                    <li key={it._id}>
                        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                                type="checkbox"
                                checked={!!it.meVoted}
                                onChange={() => onToggleVote(it._id)}
                            />
                            <div style={{ flex: 1 }}>
                                <h4 style={{ margin: 0 }}>{it.title}</h4>
                                <div style={{ color: "#777", fontSize: 13 }}>
                                    {it.tag ? `#${it.tag} · ` : ""}투표 {it.voteCount ?? 0}
                                </div>
                            </div>
                        </label>
                        {mine.find((m) => m._id === it._id) && (
                            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                                <button className="update btn" onClick={() => onUpdate(it._id)}>수정</button>
                                <button className="delete btn" onClick={() => onDelete(it._id)}>삭제</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <h3>내가 등록한 항목</h3>
            <ul className="post-list">
                {mine.map((it) => (
                    <li key={it._id}>
                        <h4 style={{ margin: 0 }}>{it.title}</h4>
                        <div style={{ color: "#777", fontSize: 13 }}>{it.tag ? `#${it.tag}` : ""}</div>
                        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                            <button className="update btn" onClick={() => onUpdate(it._id)}>수정</button>
                            <button className="delete btn" onClick={() => onDelete(it._id)}>삭제</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
