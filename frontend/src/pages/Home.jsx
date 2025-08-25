// 홈: 전체 기능 페이지
// 요구사항 반영:
// - 익명 Todo 생성/조회/수정/삭제
// - 체크(완료/투표) 토글
// - deviceId로 내 항목만 수정/삭제 가능
// - 최신순 정렬(백엔드 기본 최신 정렬 + 프런트 인기순 정렬 옵션)
// - 에러/로딩 처리
// - 공개 목록 뷰
// - 검색(q) 또는 태그(단일)
import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { ensureDeviceId } from "../utils/deviceId";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function Home() {
    const deviceId = useMemo(() => ensureDeviceId(), []);

    // 상태
    const [list, setList] = useState([]);  // 공개 목록(집계, meVoted 포함)
    const [mine, setMine] = useState([]);  // 내가 만든 항목
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState("");
    const [q, setQ] = useState("");
    const [sort, setSort] = useState("latest"); // latest | popular(프런트에서만 재정렬)
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    // 목록 불러오기
    const fetchAll = async () => {
        setLoading(true);
        setErr("");
        try {
            const params = new URLSearchParams();
            params.set("deviceId", deviceId);
            if (q) params.set("q", q);
            if (tag) params.set("tag", tag);

            const [pubRes, mineRes] = await Promise.all([
                api.get(`/options?${params.toString()}`),             // 공개 목록
                api.get(`/options/mine`, { params: { deviceId } }),   // 내 항목
            ]);

            let pub = pubRes.data || [];
            if (sort === "popular") {
                pub = [...pub].sort((a, b) => (b.voteCount ?? 0) - (a.voteCount ?? 0));
            }
            setList(pub);
            setMine(mineRes.data || []);
        } catch (e) {
            console.error(e);
            setErr("목록 불러오기 실패");
        } finally {
            setLoading(false);
        }
    };

    // 최초 + 검색/태그/정렬 변경 시
    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, tag, sort]);

    // 생성
    const onCreate = async () => {
        const t = title.trim();
        if (!t) return;
        setBusy(true);
        setErr("");
        try {
            await api.post(`/options`, { title: t, tag: tag.trim(), deviceId });
            setTitle("");
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("생성 실패");
        } finally {
            setBusy(false);
        }
    };

    // 체크(완료/선택) 토글
    const onToggle = async (optionId) => {
        setBusy(true);
        setErr("");
        try {
            await api.post(`/votes/toggle`, { optionId, deviceId });
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("체크(투표) 토글 실패");
        } finally {
            setBusy(false);
        }
    };

    // 수정(내 항목만)
    const onUpdate = async (id) => {
        const newTitle = prompt("새 제목(메뉴명):");
        if (newTitle === null) return;
        const t = newTitle.trim();
        if (!t) return;
        setBusy(true);
        setErr("");
        try {
            await api.put(`/options/${id}`, { title: t, deviceId });
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("수정 실패(내가 만든 항목만 가능)");
        } finally {
            setBusy(false);
        }
    };

    // 삭제(내 항목만)
    const onDelete = async (id) => {
        if (!confirm("삭제하시겠습니까?")) return;
        setBusy(true);
        setErr("");
        try {
            await api.delete(`/options/${id}`, { params: { deviceId } });
            await fetchAll();
        } catch (e) {
            console.error(e);
            setErr("삭제 실패(내가 만든 항목만 가능)");
        } finally {
            setBusy(false);
        }
    };

    // 검색/필터 즉시 적용
    const onApply = (e) => {
        e.preventDefault();
        fetchAll();
    };

    return (
        <div className="container">
            <header className="header">
                <h2>🍱 점심메뉴 익명 Todo(선택지)</h2>
                <p className="muted">체크 = <b>내가 선택</b> · 공개 목록은 투표수 집계</p>
            </header>

            {err && <div className="alert error">{err}</div>}

            {/* 생성 */}
            <TodoForm
                title={title}
                setTitle={setTitle}
                tag={tag}
                setTag={setTag}
                onCreate={onCreate}
                busy={busy}
            />

            {/* 검색/태그/정렬 */}
            <form className="form inline" onSubmit={onApply}>
                <div className="row">
                    <input
                        placeholder="검색어(q)"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        aria-label="검색어"
                    />
                    <button className="btn" disabled={busy}>검색/필터 적용</button>
                </div>
                <div className="row">
                    <input
                        placeholder="태그 필터(tag)"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        aria-label="태그 필터"
                    />
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
            </form>

            {/* 공개 목록 */}
            <h3>공개 목록</h3>
            <TodoList
                items={list}
                myItems={mine}
                loading={loading}
                busy={busy}
                onToggle={onToggle}
                onUpdate={onUpdate}
                onDelete={onDelete}
            />

            {/* 내 항목 */}
            <h3>내가 등록한 항목</h3>
            {!mine.length ? (
                <div className="empty">아직 내가 등록한 항목이 없어요.</div>
            ) : (
                <ul className="list">
                    {mine.map((it) => (
                        <li className="card" key={it._id}>
                            <div className="row space-between align-center">
                                <h4 className="title">{it.title}</h4>
                            </div>
                            <div className="meta">{it.tag ? `#${it.tag}` : ""}</div>
                            <div className="row gap sm mt8">
                                <button className="btn primary" onClick={() => onUpdate(it._id)} disabled={busy}>수정</button>
                                <button className="btn danger" onClick={() => onDelete(it._id)} disabled={busy}>삭제</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
