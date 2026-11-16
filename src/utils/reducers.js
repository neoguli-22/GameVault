// reducers.js - useReducer 에서 사용하는 리듀서 함수 : (현재상태, 액션) => 새로운 상태
import { LIMITS } from './constants';

// ===== 게임 목록 리듀서 =====
export function gameReducer(state, action) {
    switch (action.type) {
    case 'ADD':      // 새 게임을 맨 앞에 추가
        return [action.payload, ...state];
    case 'UPDATE':   // 같은 id 의 게임을 수정된 게임으로 교체
        return state.map(game => game.id === action.payload.id ? action.payload : game);
    case 'DELETE':   // payload = 삭제할 게임 id
        return state.filter(game => game.id !== action.payload);
    case 'RESET':    // 기본 데이터로 되돌리기
        return action.payload;
    default:
        return state;
    }
}

// ===== 장바구니 리듀서 =====
// 수업 예제(cart/CartContext.jsx)와 같은 액션 이름 사용: ADD_ITEM / REMOVE_ITEM / CLEAR_CART
// ※ 수업 예제는 uploadedItems[idx].quantity += 1 처럼 원래 객체를 직접 바꾸는데,
//   StrictMode 에서는 리듀서가 두 번 실행되어 수량이 2씩 늘 수 있다.
//   그래서 여기서는 { ...item, quantity: 새수량 } 처럼 항상 새 객체를 만든다.
// 장바구니 항목 모양: { gameId: 1, quantity: 2 }
export function cartReducer(state, action) {
    switch (action.type) {
    case 'ADD_ITEM': {   // payload = gameId
        // 추가할 게임이 장바구니에 있는지 확인
        const existing = state.find(item => item.gameId === action.payload);
        if (existing) {
            // 이미 있으면 수량 +1 (최대 5개)
            return state.map(item => item.gameId === action.payload
                ? { ...item, quantity: Math.min(item.quantity + 1, LIMITS.CART_QTY_MAX) }
                : item);
        }
        // 없으면 수량 1개로 추가
        return [...state, { gameId: action.payload, quantity: 1 }];
    }
    case 'REMOVE_ITEM': {   // 수량 -1, 수량이 1이면 장바구니에서 삭제
        const target = state.find(item => item.gameId === action.payload);
        if (!target) return state;
        if (target.quantity === 1) {
            return state.filter(item => item.gameId !== action.payload);
        }
        return state.map(item => item.gameId === action.payload
            ? { ...item, quantity: item.quantity - 1 }
            : item);
    }
    case 'DELETE_ITEM':   // 수량과 상관없이 바로 삭제
        return state.filter(item => item.gameId !== action.payload);
    case 'REMOVE_MISSING': {   // payload = 지금 있는 게임 id 목록 (삭제된 게임 정리)
        const next = state.filter(item => action.payload.includes(item.gameId));
        return next.length === state.length ? state : next;   // 바뀐 게 없으면 그대로
    }
    case 'CLEAR_CART':
        return [];   // 빈 장바구니로
    default:
        return state;
    }
}
