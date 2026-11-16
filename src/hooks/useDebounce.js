// useDebounce.js - 입력이 delay(ms) 동안 멈췄을 때만 값을 바꿔 주는 커스텀 훅
// (검색어를 칠 때마다 API 를 부르지 않도록 사용)
import { useEffect, useState } from 'react';

export function useDebounce(value, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeId = setTimeout(() => setDebounced(value), delay);
        // 클린업: 그 전에 값이 또 바뀌면 이전 타이머 취소
        return () => clearTimeout(timeId);
    }, [value, delay]);

    return debounced;
}
