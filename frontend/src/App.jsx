import { useEffect, useState } from "react";
import { getMenus, addMenu, voteMenu, deleteMenu } from "./api/axios";

function App() {
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState("");

  // 메뉴 불러오기
  useEffect(() => {
    loadMenus();
  }, []);

  async function loadMenus() {
    try {
      const { data } = await getMenus(); // axios는 { data: ... } 형태 반환
      setMenus(data);
    } catch (err) {
      console.error("메뉴 불러오기 실패:", err);
    }
  }

  async function handleAdd() {
    if (!newMenu.trim()) return;
    await addMenu(newMenu);
    setNewMenu("");
    loadMenus();
  }

  async function handleVote(id) {
    await voteMenu(id);
    loadMenus();
  }

  async function handleDelete(id) {
    await deleteMenu(id);
    loadMenus();
  }

  return (
    <div>
      <h1>🍔 메뉴 투표</h1>
      <input
        value={newMenu}
        onChange={(e) => setNewMenu(e.target.value)}
        placeholder="메뉴 이름 입력"
      />
      <button onClick={handleAdd}>추가</button>

      <ul>
        {menus.map((m) => (
          <li key={m._id}>
            {m.name} ({m.votes})
            <button onClick={() => handleVote(m._id)}>+1</button>
            <button onClick={() => handleDelete(m._id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
