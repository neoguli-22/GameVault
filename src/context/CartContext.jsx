// CartContext.jsx - 장바구니 전역 상태 (useReducer + useContext)
// 수업 예제 cart/CartContext.jsx 와 같은 구조
import { createContext, useContext, useEffect, useReducer } from 'react';
import { cartReducer } from '../utils/reducers';
import { getSalePrice } from '../utils/price';
import { STORAGE_KEYS } from '../utils/constants';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useStore } from './StoreContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const { games } = useStore();
    // 장바구니 항목: [{ gameId, quantity }] - 처음에 LocalStorage 에서 불러오기
    const [items, dispatch] = useReducer(cartReducer, [],
        (initial) => loadFromStorage(STORAGE_KEYS.CART, initial));

    // 장바구니가 바뀌면 저장
    useEffect(() => { saveToStorage(STORAGE_KEYS.CART, items); }, [items]);

    // 게임 관리에서 게임을 삭제하면 장바구니에서도 빼기
    useEffect(() => {
        dispatch({ type: 'REMOVE_MISSING', payload: games.map(g => g.id) });
    }, [games]);

    // 장바구니 항목에 게임 정보와 금액 붙이기 (게임 정보는 games 에서 찾음)
    const details = [];
    items.forEach(item => {
        const game = games.find(g => g.id === item.gameId);
        if (!game) return;
        const unitPrice = getSalePrice(game);   // 할인 적용 가격
        details.push({ game, quantity: item.quantity, unitPrice, subtotal: unitPrice * item.quantity });
    });

    const cartCount = details.reduce((acc, d) => acc + d.quantity, 0);                     // 전체 수량
    const originalTotal = details.reduce((acc, d) => acc + d.game.price * d.quantity, 0);  // 정가 합계
    const totalPrice = details.reduce((acc, d) => acc + d.subtotal, 0);                    // 결제 금액

    // 리듀서를 부르는 함수들 (수업 예제의 addItem / removeItem / clearCart)
    const addToCart = (gameId) => dispatch({ type: 'ADD_ITEM', payload: gameId });
    const decreaseItem = (gameId) => dispatch({ type: 'REMOVE_ITEM', payload: gameId });   // 수량 -1
    const removeFromCart = (gameId) => dispatch({ type: 'DELETE_ITEM', payload: gameId }); // 바로 삭제
    const clearCart = () => dispatch({ type: 'CLEAR_CART' });
    const isInCart = (gameId) => items.some(item => item.gameId === gameId);

    const value = {
        details, cartCount, originalTotal, totalPrice,
        addToCart, decreaseItem, removeFromCart, clearCart, isInCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    return useContext(CartContext);
}
