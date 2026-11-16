// GameGrid.jsx - 게임 카드 목록 (홈 / 스토어에서 같이 사용)
import { useStore } from '../context/StoreContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { averageRating } from '../utils/price';
import GameCard from './GameCard';

export default function GameGrid({ games }) {
    const { reviews } = useStore();
    const { addToCart } = useCart();
    const showToast = useToast();

    // 장바구니 버튼을 눌렀을 때
    const handleAddCart = (gameId) => {
        addToCart(gameId);
        showToast('장바구니에 담았습니다.');
    };

    return (
        <div className="game-grid">
            {games.map(game => {
                // 이 게임의 리뷰만 골라서 평균 평점 계산
                const gameReviews = reviews.filter(r => r.gameId === game.id);
                return (
                    <GameCard key={game.id} game={game}
                        rating={averageRating(gameReviews)} reviewCount={gameReviews.length}
                        onAddCart={handleAddCart} />
                );
            })}
        </div>
    );
}
