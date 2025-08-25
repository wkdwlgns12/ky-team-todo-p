// TodoList.jsx
// 목록 출력 + 투표/수정/삭제 버튼
export default function TodoList({ items, loading, busy, onVote, onUpdate, onDelete }) {
    if (loading) return <p>로딩 중...</p>;
    if (!items || items.length === 0) return <p>현재 등록된 메뉴가 없습니다.</p>;

    return (
        <ul className="list">
            {items.map((it) => (
                <li className="card" key={it._id}>
                    <div className="row space-between align-center">
                        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                                type="checkbox"
                                onChange={() => onVote(it._id, false)} // 단순 +1 버튼 역할
                            />
                            <h4 className="title">{it.name}</h4>
                        </label>
                        <span className="meta">투표수: {it.votes ?? 0}</span>
                    </div>
                    <div className="row gap sm mt8">
                        <button className="btn primary" onClick={() => onUpdate(it._id)} disabled={busy}>
                            수정
                        </button>
                        <button className="btn danger" onClick={() => onDelete(it._id)} disabled={busy}>
                            삭제
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
