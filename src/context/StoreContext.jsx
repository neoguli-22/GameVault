// StoreContext.jsx - 게임 / 리뷰 / 주문 데이터를 전역으로 관리 + LocalStorage 저장
import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { INITIAL_GAMES, INITIAL_REVIEWS } from '../data/initialData';
import { gameReducer } from '../utils/reducers';
import { STORAGE_KEYS } from '../utils/constants';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const StoreContext = createContext();

// 새 데이터의 id 만들기 (같은 시간에 여러 개를 만들어도 겹치지 않게)
let lastId = 0;
function createId() {
    const now = Date.now();
    lastId = now > lastId ? now : lastId + 1;
    return lastId;
}

export function StoreProvider({ children }) {
    // 처음에 LocalStorage 에서 불러오기 (없으면 기본 데이터)
    const [games, dispatch] = useReducer(gameReducer, INITIAL_GAMES,
        (initial) => loadFromStorage(STORAGE_KEYS.GAMES, initial));
    const [reviews, setReviews] = useState(() => loadFromStorage(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS));
    const [orders, setOrders] = useState(() => loadFromStorage(STORAGE_KEYS.ORDERS, []));

    // 값이 바뀔 때마다 LocalStorage 에 저장
    useEffect(() => { saveToStorage(STORAGE_KEYS.GAMES, games); }, [games]);
    useEffect(() => { saveToStorage(STORAGE_KEYS.REVIEWS, reviews); }, [reviews]);
    useEffect(() => { saveToStorage(STORAGE_KEYS.ORDERS, orders); }, [orders]);

    // ===== 게임 등록 / 수정 / 삭제 =====
    const addGame = (input) => {
        const newGame = { ...input, title: input.title.trim(), id: createId(), createdAt: Date.now() };
        dispatch({ type: 'ADD', payload: newGame });
        return newGame;
    };

    const updateGame = (id, input) => {
        const target = games.find(g => g.id === id);
        if (!target) return;
        dispatch({ type: 'UPDATE', payload: { ...target, ...input, title: input.title.trim() } });
    };

    const deleteGame = (id) => {
        dispatch({ type: 'DELETE', payload: id });
        // 삭제한 게임의 리뷰도 같이 삭제 (장바구니는 CartContext 에서 정리)
        setReviews(prev => prev.filter(r => r.gameId !== id));
    };

    const resetGames = () => {
        dispatch({ type: 'RESET', payload: INITIAL_GAMES });
        setReviews(INITIAL_REVIEWS);
    };

    // ===== 리뷰 등록 / 수정 / 삭제 =====
    const addReview = (gameId, input) => {
        const review = {
            id: createId(),
            gameId,
            author: input.author.trim(),
            rating: input.rating,
            content: input.content.trim(),
            createdAt: Date.now(),
        };
        setReviews(prev => [review, ...prev]);
    };

    const updateReview = (id, input) => {
        setReviews(prev => prev.map(r => r.id === id
            ? { ...r, author: input.author.trim(), rating: input.rating, content: input.content.trim(), updatedAt: Date.now() }
            : r));
    };

    const deleteReview = (id) => {
        setReviews(prev => prev.filter(r => r.id !== id));
    };

    // ===== 주문 =====
    // items = [{ gameId, title, unitPrice, quantity }] (주문할 때의 가격을 그대로 저장)
    const placeOrder = (buyer, email, items) => {
        const order = {
            id: createId(),
            buyer: buyer.trim(),
            email: email.trim(),
            items,
            totalPrice: items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0),
            createdAt: Date.now(),
        };
        setOrders(prev => [order, ...prev]);
        return order;
    };

    const value = {
        games, addGame, updateGame, deleteGame, resetGames,
        reviews, addReview, updateReview, deleteReview,
        orders, placeOrder,
    };

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// 다른 컴포넌트에서 const { games } = useStore(); 처럼 사용
export function useStore() {
    return useContext(StoreContext);
}
