// 항목(선택지) 생성 폼: 제목(title), 태그(tag) 입력 + 추가 버튼
export default function TodoForm({ title, setTitle, tag, setTag, onCreate, busy }) {
    const submit = (e) => {
        e.preventDefault();
        onCreate();
    };

    return (
        <form className="form" onSubmit={submit}>
            <div className="row">
                <input
                    placeholder="메뉴 입력 (예: 김치찌개)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="메뉴명"
                />
                <button className="btn primary" type="submit" disabled={busy || !title.trim()}>
                    추가
                </button>
            </div>
            <div className="row">
                <input
                    placeholder="태그 (예: 한식/분식/중식/일식...)"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    aria-label="태그"
                />
            </div>
        </form>
    );
}
