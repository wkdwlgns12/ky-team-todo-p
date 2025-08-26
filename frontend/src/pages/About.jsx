import { useEffect, useState } from "react";
import api from "../api/axios";

export default function About() {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [err, setErr] = useState("");

    const fetchMenus = async () => {
        try {
            const res = await api.get("/menus");
            setList(res.data || []);
            setFiltered(res.data || []);
        } catch (e) {
            console.error(e);
            setErr("목록 불러오기 실패");
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const onSearch = (e) => {
        e.preventDefault();
        const keyword = search.trim().toLowerCase();
        if (!keyword) {
            setFiltered(list);
        } else {
            setFiltered(list.filter((it) => it.name.toLowerCase().includes(keyword)));
        }
    };

    // 날짜 포맷 함수
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleString("ko-KR", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit"
        });
    };

    return (
        <div className="container">
            <h2>점심 검색</h2>
            <p>점심 메뉴를 검색하고 찾아볼 수 있음.</p>

            <h3>점심 검색</h3>
            <form className="form inline" onSubmit={onSearch}>
                <input
                    placeholder="메뉴 이름 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn">검색</button>
            </form>

            {err && <div className="alert error">{err}</div>}

            <ul className="list">
                {filtered.map((it) => (
                    <li key={it._id} className="card">
                        <h4 className="title">{it.name}</h4>
                        <div className="meta">투표수: {it.votes ?? 0}</div>
                        {it.createdAt && (
                            <div className="meta">생성일: {formatDate(it.createdAt)}</div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
