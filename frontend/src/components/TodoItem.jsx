// 단일 항목 카드
// - 체크박스 = 내가 선택(완료/투표)
// - isMine=true면 수정/삭제 버튼 노출
export default function TodoItem({ item, isMine, busy, onToggle, onUpdate, onDelete }) {
    return (
        <li className="card">
            <label className="row align-center">
                <input
                    type="checkbox"
                    checked={!!item.meVoted}
                    onChange={() => onToggle(item._id)}
                    disabled={busy}
                    aria-label={`${item.title} 선택`}
                />
                <div className="grow">
                    <div className="row space-between align-center">
                        <h4 className="title">{item.title}</h4>
                        <span className="badge">{item.voteCount ?? 0}</span>
                    </div>
                    <div className="meta">{item.tag ? `#${item.tag}` : ""}</div>
                </div>
            </label>

            {isMine && (
                <div className="row gap sm mt8">
                    <button className="btn primary" onClick={() => onUpdate(item._id)} disabled={busy}>
                        수정
                    </button>
                    <button className="btn danger" onClick={() => onDelete(item._id)} disabled={busy}>
                        삭제
                    </button>
                </div>
            )}
        </li>
    );
}
