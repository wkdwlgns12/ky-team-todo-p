// 익명(무계정) 식별용 deviceId 생성/보관
export function ensureDeviceId() {
    const KEY = "deviceId";
    let id = localStorage.getItem(KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(KEY, id);
    }
    return id;
}
