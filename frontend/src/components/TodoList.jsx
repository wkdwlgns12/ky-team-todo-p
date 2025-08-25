// 공개 목록 뷰
// - 로딩 스켈레톤 / 빈 상태 / 항목 리스트 표시
import TodoItem from "./TodoItem";

export default function TodoList({
    items, myItems, loading, busy, onToggle, onUpdate, onDelete,
}) {
    if (loading) {
        return (
            <ul className="list">
                {Array.from({ length: 3 }).map((_, i) => (
                    <li className="card skeleton" key={i}>
                        <div className="sk-line" />
                        <div className="sk-sub" />
                    </li>
                ))}
            </ul>
        );
    }

    if (!items?.length) {
        return <div className="empty">현재 조건에 맞는 항목이 없어요. 첫 항목을 추가해보세요!</div>;
    }

    return (
        <ul className="list">
            {items.map((it) => (
                <TodoItem
                    key={it._id}
                    item={it}
                    isMine={!!myItems.find((m) => m._id === it._id)}
                    busy={busy}
                    onToggle={onToggle}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
}
