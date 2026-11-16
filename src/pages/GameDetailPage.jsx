// GameDetailPage.jsx - 게임 상세 정보 + 구매 버튼 + 리뷰
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { averageRating, formatKRW, getSalePrice } from '../utils/price';
import { EmptyState, GameCover, PageTitle, PriceTag, StarRating } from '../components/common';
import ReviewSection from '../components/ReviewSection';

export default function GameDetailPage() {
    const { gameId } = useParams();   // 주소 /games/:gameId 의 값 (문자열)
    const navigate = useNavigate();
    const { games, reviews } = useStore();
    const { addToCart, isInCart } = useCart();
    const showToast = useToast();

    const game = games.find(g => g.id === Number(gameId));

    // 없는 게임이면 안내
    if (!game) {
        return (
            <EmptyState title="게임을 찾을 수 없습니다.">
                <p className="muted">삭제되었거나 잘못된 주소입니다.</p>
                <Link to="/store" className="btn btn-primary">스토어로 이동</Link>
            </EmptyState>
        );
    }

    const gameReviews = reviews.filter(r => r.gameId === game.id);
    const saved = game.price - getSalePrice(game);   // 절약 금액

    // 바로 구매: 장바구니에 없으면 담고 장바구니 페이지로 이동
    const handleBuyNow = () => {
        if (!isInCart(game.id)) addToCart(game.id);
        navigate('/cart');
    };

    const handleAddCart = () => {
        addToCart(game.id);
        showToast('장바구니에 담았습니다.');
    };

    return (
        <>
            <div className="sr-only"><PageTitle title={game.title} /></div>
            <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> 뒤로가기
            </button>

            <section className="detail">
                <GameCover game={game} size="lg" />
                <div className="detail-info">
                    <div className="chips">
                        <span className="chip">{game.genre}</span>
                        {game.platforms.map(p => <span key={p} className="chip outline">{p}</span>)}
                    </div>
                    <h2 className="detail-title">{game.title}</h2>
                    <StarRating value={averageRating(gameReviews)} count={gameReviews.length} />

                    <dl className="info-table">
                        <div><dt>개발사</dt><dd>{game.developer}</dd></div>
                        <div><dt>출시일</dt><dd>{game.releaseDate}</dd></div>
                        <div><dt>장르</dt><dd>{game.genre}</dd></div>
                        <div><dt>지원 플랫폼</dt><dd>{game.platforms.join(', ')}</dd></div>
                    </dl>

                    <div className="buy-box card">
                        <PriceTag game={game} large />
                        {saved > 0 && <p className="muted small">정가 대비 {formatKRW(saved)} 절약</p>}
                        <div className="btn-row">
                            <button className="btn btn-primary" onClick={handleBuyNow}><Zap size={16} /> 바로 구매</button>
                            <button className="btn btn-ghost" onClick={handleAddCart}><ShoppingCart size={16} /> 장바구니</button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section card">
                <h2>게임 소개</h2>
                <p className="description">{game.description}</p>
            </section>

            <ReviewSection gameId={game.id} />
        </>
    );
}
