export default function TodoItem({ item, busy, onVote, onUnvote, onUpdate, onDelete }) {
    return (
        <li className="card">
            <div className="row space-between align-center">
                <div className="grow">
                    <h4 className="title">{item.name}</h4>
                </div>
                <div className="vote-info">투표수: {item.votes ?? 0}</div>
            </div>

            {/* 투표 / 취소 버튼 */}
            <div className="row-actions">
                <button className="btn primary" onClick={() => onVote(item._id)} disabled={busy}>
                    투표하기
                </button>
                <button className="btn danger" onClick={() => onUnvote(item._id)} disabled={busy}>
                    투표 취소
                </button>
            </div>

            {/* 수정/삭제 */}
            <div className="row-actions mt8">
                <button className="btn primary" onClick={() => onUpdate(item._id)} disabled={busy}>
                    수정
                </button>
                <button className="btn danger" onClick={() => onDelete(item._id)} disabled={busy}>
                    삭제
                </button>
            </div>
        </li>
    );
}
