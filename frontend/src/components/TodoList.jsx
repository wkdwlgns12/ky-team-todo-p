import TodoItem from "./TodoItem";

export default function TodoList({ items, loading, busy, onVote, onUnvote, onUpdate, onDelete }) {
    if (loading) return <p>로딩 중...</p>;
    if (!items?.length) return <div className="empty">현재 메뉴가 없습니다.</div>;

    return (
        <ul className="list">
            {items.map((it) => (
                <TodoItem
                    key={it._id}
                    item={it}
                    busy={busy}
                    onVote={onVote}
                    onUnvote={onUnvote}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}
