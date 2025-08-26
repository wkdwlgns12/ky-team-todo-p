import { useEffect, useState } from "react";
import api from "../api/axios";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function Home() {
    const [list, setList] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    const fetchAll = async () => {
        setLoading(true);
        setErr("");
        try {
            const res = await api.get("/menus");
            setList(res.data || []);
        } catch (e) {
            console.error(e);
            setErr("목록 불러오기 실패");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const onCreate = async () => {
        if (!title.trim()) return;
        setBusy(true);
        try {
            await api.post("/menus", { name: title.trim() });
            setTitle("");
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("생성 실패");
        } finally {
            setBusy(false);
        }
    };

    const onVote = async (id) => {
        setBusy(true);
        try {
            await api.post(`/menus/${id}/vote`);
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("투표 실패");
        } finally {
            setBusy(false);
        }
    };

    const onUnvote = async (id) => {
        setBusy(true);
        try {
            await api.post(`/menus/${id}/unvote`);
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("투표 취소 실패");
        } finally {
            setBusy(false);
        }
    };

    const onUpdate = async (id) => {
        const newName = prompt("새 메뉴명:");
        if (!newName || !newName.trim()) return;
        setBusy(true);
        try {
            await api.put(`/menus/${id}`, { name: newName.trim() });
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("수정 실패");
        } finally {
            setBusy(false);
        }
    };

    const onDelete = async (id) => {
        if (!confirm("삭제하시겠습니까?")) return;
        setBusy(true);
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
                <h2>🍱 점심메뉴 투표</h2>
                <p className="muted">버튼 = 투표/취소 · 목록은 전체 투표수 집계</p>
            </header>

            {err && <div className="alert error">{err}</div>}

            <TodoForm title={title} setTitle={setTitle} onCreate={onCreate} busy={busy} />

            <h3>전체 메뉴</h3>
            <TodoList
                items={list}
                loading={loading}
                busy={busy}
                onVote={onVote}
                onUnvote={onUnvote}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />
        </div>
    );
}
