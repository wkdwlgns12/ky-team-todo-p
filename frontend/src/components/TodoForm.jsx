export default function TodoForm({ title, setTitle, onCreate, busy }) {
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
                />
                <button className="btn primary" type="submit" disabled={busy || !title.trim()}>
                    추가
                </button>
            </div>
        </form>
    );
}
