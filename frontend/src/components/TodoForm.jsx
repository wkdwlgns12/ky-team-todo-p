// TodoForm.jsx
// 메뉴 추가 입력 폼
export default function TodoForm({ name, setName, onCreate, busy }) {
    return (
        <form
            className="form"
            onSubmit={(e) => {
                e.preventDefault();
                onCreate();
            }}
        >
            <div className="row">
                <input
                    placeholder="메뉴 입력 (예: 김치찌개)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={busy}
                />
                <button className="btn primary" type="submit" disabled={busy}>
                    추가
                </button>
            </div>
        </form>
    );
}
