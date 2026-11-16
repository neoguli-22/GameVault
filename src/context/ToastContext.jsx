// ToastContext.jsx - 화면 아래에 잠깐 나타나는 알림 메시지 (alert 대신 사용)
import { createContext, useContext, useEffect, useState } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toast, setToast] = useState(null);   // { id, message, type }

    // 알림 보여주기. type: 'success' | 'error' | 'info'
    const showToast = (message, type = 'success') => {
        setToast({ id: Date.now(), message, type });
    };

    // 2.5초 후 자동으로 사라짐 (새 알림이 오면 이전 타이머는 클린업으로 정리)
    useEffect(() => {
        if (!toast) return;
        const timeId = setTimeout(() => setToast(null), 2500);
        return () => clearTimeout(timeId);
    }, [toast]);

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            {toast && (
                <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    );
}

// const showToast = useToast(); → showToast('저장했습니다.');
export function useToast() {
    return useContext(ToastContext);
}
