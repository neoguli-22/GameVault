// GameCard.jsx - 게임 목록의 카드 1개
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { GameCover, PriceTag, StarRating } from './common';

export default function GameCard({ game, rating, reviewCount, onAddCart }) {
    return (
        <article className="game-card" data-testid="game-card">
            {/* 카드를 누르면 상세 페이지로 이동 */}
            <Link to={`/games/${game.id}`} className="game-card-link">
                <GameCover game={game} />
                <div className="game-card-body">
                    <div className="game-card-meta">
                        <span className="chip">{game.genre}</span>
                        <StarRating value={rating} count={reviewCount} />
                    </div>
                    <h3 className="game-card-title">{game.title}</h3>
                    <p className="platforms">{game.platforms.join(' · ')}</p>
                </div>
            </Link>
            <div className="game-card-footer">
                <PriceTag game={game} />
                <div className="card-actions">
                    <button className="icon-btn primary" onClick={() => onAddCart(game.id)}
                        aria-label={`${game.title} 장바구니 담기`}>
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </article>
    );
}
