// storage.js - LocalStorage 저장 / 불러오기

// 저장된 값을 불러오기. 없거나 읽을 수 없으면 기본값(fallback) 사용
export function loadFromStorage(key, fallback) {
    try {
        const saved = localStorage.getItem(key);
        if (saved === null) return fallback;          // 저장된 값이 없음
        const data = JSON.parse(saved);
        // 배열이어야 하는데 배열이 아니면 잘못된 데이터 → 기본값
        if (Array.isArray(fallback) && !Array.isArray(data)) return fallback;
        return data;
    } catch {
        // JSON 형식이 깨져 있어도 앱이 멈추지 않도록 기본값 사용
        return fallback;
    }
}

// 값을 JSON 문자열로 바꿔서 저장
export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
