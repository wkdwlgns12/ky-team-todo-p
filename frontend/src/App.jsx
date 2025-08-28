import { useEffect, useState } from "react";
import {
  getMenus,
  addMenu,
  voteMenu,
  unvoteMenu,
  updateMenu,
  deleteMenu
} from "./api/axios";
import "./App.css";

function App() {
  const [menus, setMenus] = useState([]);
  const [newMenu, setNewMenu] = useState("");

  // 메뉴 불러오기
  useEffect(() => {
    loadMenus();
  }, []);

  async function loadMenus() {
    try {
      const { data } = await getMenus();
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

  async function handleUnvote(id) {
    await unvoteMenu(id);
    loadMenus();
  }

  async function handleUpdate(id) {
    const name = prompt("새 메뉴 이름을 입력하세요:");
    if (name) {
      await updateMenu(id, name);
      loadMenus();
    }
  }

  async function handleDelete(id) {
    await deleteMenu(id);
    loadMenus();
  }

  return (
    <div className="App">
      <h1>🍔 메뉴 투표</h1>
      <div className="input-area">
        <input
          value={newMenu}
          onChange={(e) => setNewMenu(e.target.value)}
          placeholder="메뉴 이름 입력"
        />
        <button onClick={handleAdd}>추가</button>
      </div>

      <ul className="menu-list">
        {menus.map((m) => (
          <li key={m._id} className="menu-item">
            <span>{m.name} ({m.votes})</span>
            <div className="btn-group">
              <button onClick={() => handleVote(m._id)}>+1</button>
              <button onClick={() => handleUnvote(m._id)}>-1</button>
              <button onClick={() => handleUpdate(m._id)}>수정</button>
              <button onClick={() => handleDelete(m._id)}>삭제</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
