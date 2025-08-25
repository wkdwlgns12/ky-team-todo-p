// Home.jsx
// 백엔드 /api/menus 구조에 맞춘 전체 코드
import { useEffect, useState } from "react";
import api from "../api/axios";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function Home() {
    const [list, setList] = useState([]);   // 공개 목록
    const [name, setName] = useState("");   // 입력값
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    const [sort, setSort] = useState("latest"); // latest | popular

    // 목록 불러오기
    const fetchAll = async () => {
        setLoading(true);
        setErr("");
        try {
            const res = await api.get(`/menus`);
            let pub = res.data || [];

            if (sort === "popular") {
                pub = [...pub].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
            } else {
                pub = [...pub].sort((a, b) => new Date(b._id) - new Date(a._id));
            }

            setList(pub);
        } catch (e) {
            console.error(e);
            setErr("목록 불러오기 실패");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, [sort]);

    // 생성
    const onCreate = async () => {
        const t = name.trim();
        if (!t) return;
        setBusy(true);
        setErr("");
        try {
            await api.post(`/menus`, { name: t });
            setName("");
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("생성 실패");
        } finally {
            setBusy(false);
        }
    };

    // 투표
    const onVote = async (id, isVoted) => {
        setBusy(true);
        setErr("");
        try {
            if (!isVoted) {
                await api.post(`/menus/${id}/vote`);
            } else {
                await api.post(`/menus/${id}/unvote`);
            }
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("투표 처리 실패");
        } finally {
            setBusy(false);
        }
    };

    // 수정
    const onUpdate = async (id) => {
        const newName = prompt("새 메뉴명:");
        if (newName === null) return;
        const t = newName.trim();
        if (!t) return;
        setBusy(true);
        setErr("");
        try {
            await api.put(`/menus/${id}`, { name: t });
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("수정 실패");
        } finally {
            setBusy(false);
        }
    };

    // 삭제
    const onDelete = async (id) => {
        if (!confirm("삭제하시겠습니까?")) return;
        setBusy(true);
        setErr("");
        try {
            await api.delete(`/menus/${id}`);
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("삭제 실패");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h2>🍱 점심메뉴 익명 Todo(선택지)</h2>
                <p className="muted">체크 = <b>투표</b> · 공개 목록은 투표수 집계</p>
            </header>

            {err && <div className="alert error">{err}</div>}

            {/* 생성 */}
            <TodoForm
                name={name}
                setName={setName}
                onCreate={onCreate}
                busy={busy}
            />

            {/* 정렬 */}
            <div className="row mt16">
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="select"
                    aria-label="정렬"
                >
                    <option value="latest">최신순</option>
                    <option value="popular">인기순(투표 많은 순)</option>
                </select>
            </div>

            {/* 공개 목록 */}
            <h3>공개 목록</h3>
            <TodoList
                items={list}
                loading={loading}
                busy={busy}
                onVote={onVote}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        </div>
    );
}
