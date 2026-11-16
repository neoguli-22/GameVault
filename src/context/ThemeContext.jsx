// ThemeContext.jsx - 라이트/다크 테마 전역 상태 (useContext)
import { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // 저장된 테마가 'dark' 면 다크, 아니면 라이트(기본)
    const [theme, setTheme] = useState(() =>
        localStorage.getItem(STORAGE_KEYS.THEME) === 'dark' ? 'dark' : 'light');

    // 테마가 바뀌면 <html data-theme="dark"> 처럼 속성을 바꾸고 저장 (CSS 가 이 속성으로 색을 바꿈)
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
