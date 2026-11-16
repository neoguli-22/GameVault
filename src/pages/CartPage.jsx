// CartPage.jsx - 장바구니 (수량 변경, 삭제, 금액 합계, 주문)
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CircleCheck, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { formatDateTime, formatKRW } from '../utils/price';
import { hasErrors, validateCheckout } from '../utils/validation';
import { LIMITS } from '../utils/constants';
import { ConfirmButton, EmptyState, GameCover, PageTitle } from '../components/common';

export default function CartPage() {
    const { details, cartCount, originalTotal, totalPrice, addToCart, decreaseItem, removeFromCart, clearCart } = useCart();
    const { placeOrder } = useStore();
    const showToast = useToast();
    const [checkout, setCheckout] = useState({ buyer: '', email: '' });   // 주문 폼 입력값
    const [errors, setErrors] = useState({});
    const [completedOrder, setCompletedOrder] = useState(null);           // 방금 완료한 주문
    const buyerRef = useRef(null);
    const emailRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCheckout({ ...checkout, [name]: value });
    };

    // 주문하기
    const handleOrder = (e) => {
        e.preventDefault();   // 새로고침 방지
        const result = validateCheckout(checkout);
        setErrors(result);
        if (hasErrors(result)) {
            // 오류가 있는 첫 번째 칸으로 포커스 이동 (useRef)
            if (result.buyer) buyerRef.current.focus();
            else emailRef.current.focus();
            return;
        }
        // 주문할 때의 제목과 가격을 그대로 저장
        const items = details.map(d => ({
            gameId: d.game.id, title: d.game.title, unitPrice: d.unitPrice, quantity: d.quantity,
        }));
        const order = placeOrder(checkout.buyer, checkout.email, items);
        clearCart();
        setCheckout({ buyer: '', email: '' });
        setCompletedOrder(order);
        showToast('주문이 완료되었습니다.');
    };

    // − 버튼: 수업 예제처럼 수량이 1일 때 누르면 장바구니에서 삭제
    const handleDecrease = (gameId, quantity) => {
        decreaseItem(gameId);
        if (quantity === 1) showToast('장바구니에서 삭제했습니다.', 'info');
    };

    const handleRemove = (gameId) => {
        removeFromCart(gameId);
        showToast('장바구니에서 삭제했습니다.', 'info');
    };

    // ===== 주문 완료 화면 =====
    if (completedOrder) {
        return (
            <>
                <PageTitle title="주문 완료" />
                <section className="card order-done" data-testid="order-done">
                    <p className="order-done-title"><CircleCheck size={22} /> {completedOrder.buyer}님, 주문이 완료되었습니다.</p>
                    <p className="muted small">
                        주문번호 {completedOrder.id} · {formatDateTime(completedOrder.createdAt)} · 게임 코드는 {completedOrder.email}(으)로 발송됩니다.
                    </p>
                    <table className="order-table">
                        <thead><tr><th>게임</th><th>단가</th><th>수량</th><th>금액</th></tr></thead>
                        <tbody>
                            {completedOrder.items.map(item => (
                                <tr key={item.gameId}>
                                    <td>{item.title}</td>
                                    <td>{formatKRW(item.unitPrice)}</td>
                                    <td>{item.quantity}</td>
                                    <td>{formatKRW(item.unitPrice * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="order-total">총 결제 금액 <b data-testid="order-total">{formatKRW(completedOrder.totalPrice)}</b></p>
                    <div className="btn-row end">
                        <Link to="/store" className="btn btn-primary">쇼핑 계속하기</Link>
                    </div>
                </section>
            </>
        );
    }

    // ===== 빈 장바구니 =====
    if (details.length === 0) {
        return (
            <>
                <PageTitle title="장바구니" />
                <EmptyState title="장바구니가 비어 있습니다.">
                    <Link to="/store" className="btn btn-primary">게임 둘러보기</Link>
                </EmptyState>
            </>
        );
    }

    // ===== 장바구니 목록 + 주문 폼 =====
    return (
        <>
            <PageTitle title="장바구니" sub={`담긴 게임 ${cartCount}개`} />
            <div className="cart-layout">
                <section>
                    <ul className="cart-list">
                        {details.map(({ game, quantity, unitPrice, subtotal }) => (
                            <li key={game.id} className="cart-item card" data-testid="cart-item">
                                <Link to={`/games/${game.id}`} className="cart-thumb"><GameCover game={game} /></Link>
                                <div className="cart-info">
                                    <Link to={`/games/${game.id}`} className="cart-title">{game.title}</Link>
                                    <p className="muted small">{game.platforms.join(' · ')}</p>
                                    <p className="small">
                                        {game.discountRate > 0 && <span className="original">{formatKRW(game.price)}</span>}
                                        <b> {formatKRW(unitPrice)}</b>
                                    </p>
                                </div>
                                <div className="qty">
                                    <button className="icon-btn" aria-label="수량 감소" onClick={() => handleDecrease(game.id, quantity)}>
                                        <Minus size={16} />
                                    </button>
                                    <span data-testid="qty">{quantity}</span>
                                    <button className="icon-btn" aria-label="수량 증가" disabled={quantity >= LIMITS.CART_QTY_MAX}
                                        onClick={() => addToCart(game.id)}>
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <p className="cart-subtotal">{formatKRW(subtotal)}</p>
                                <button className="icon-btn" aria-label={`${game.title} 삭제`} onClick={() => handleRemove(game.id)}>
                                    <Trash2 size={18} />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="btn-row">
                        <ConfirmButton label="장바구니 비우기" confirmLabel="모두 삭제할까요?" className="btn btn-ghost btn-sm"
                            onConfirm={() => { clearCart(); showToast('장바구니를 비웠습니다.', 'info'); }} />
                    </div>
                </section>

                <aside className="summary card">
                    <h2>결제 정보</h2>
                    <dl className="summary-rows">
                        <div><dt>상품 금액</dt><dd>{formatKRW(originalTotal)}</dd></div>
                        <div><dt>할인 금액</dt><dd className="minus">-{(originalTotal - totalPrice).toLocaleString('ko-KR')}원</dd></div>
                        <div className="total"><dt>결제 예정 금액</dt><dd data-testid="total-price">{formatKRW(totalPrice)}</dd></div>
                    </dl>
                    <form onSubmit={handleOrder} noValidate>
                        <label className="field">
                            <span>구매자 이름</span>
                            <input ref={buyerRef} name="buyer" value={checkout.buyer} onChange={handleChange} placeholder="홍길동" />
                            {errors.buyer && <p className="field-error">{errors.buyer}</p>}
                        </label>
                        <label className="field">
                            <span>이메일 (게임 코드 받을 주소)</span>
                            <input ref={emailRef} type="email" name="email" value={checkout.email} onChange={handleChange}
                                placeholder="game@example.com" />
                            {errors.email && <p className="field-error">{errors.email}</p>}
                        </label>
                        <button type="submit" className="btn btn-primary btn-block">{formatKRW(totalPrice)} 결제하기</button>
                        <p className="muted small center">학습용 프로젝트로 실제 결제는 이루어지지 않습니다.</p>
                    </form>
                </aside>
            </div>
        </>
    );
}
