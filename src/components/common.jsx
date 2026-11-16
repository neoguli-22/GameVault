// common.jsx - 여러 페이지에서 같이 쓰는 작은 컴포넌트 모음
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { formatKRW, getSalePrice } from '../utils/price';

// 장르별 기본 커버 색 (이미지가 없을 때 사용)
const GENRE_COLORS = {
    '액션': '#ffb4a2', 'RPG': '#b8c0ff', '어드벤처': '#a0e7c8', '전략': '#ffd6a5', '시뮬레이션': '#c7f0b8',
    '스포츠': '#a5e8f5', '레이싱': '#fdf3a6', '퍼즐': '#e4c1f9', '인디': '#ffc6e5',
};

// 게임 커버 이미지 (이미지가 없거나 불러오기에 실패하면 장르 색 커버)
export function GameCover({ game, size = 'md' }) {
    const [failed, setFailed] = useState(false);   // 이미지 불러오기 실패 여부

    if (game.imageUrl && !failed) {
        return (
            <div className={`cover cover-${size}`}>
                <img src={game.imageUrl} alt={`${game.title} 커버`} onError={() => setFailed(true)} />
            </div>
        );
    }
    return (
        <div className={`cover cover-${size} cover-placeholder`} style={{ background: GENRE_COLORS[game.genre] }}>
            <span className="cover-genre">{game.genre}</span>
            <span className="cover-title">{game.title}</span>
        </div>
    );
}

// 가격 표시 (할인 중이면 정가에 줄을 긋고 할인율 표시)
export function PriceTag({ game, large = false }) {
    return (
        <div className={`price-tag ${large ? 'large' : ''}`}>
            {game.discountRate > 0 && <span className="discount">-{game.discountRate}%</span>}
            <div className="price-values">
                {game.discountRate > 0 && <span className="original">{formatKRW(game.price)}</span>}
                <span className="sale">{formatKRW(getSalePrice(game))}</span>
            </div>
        </div>
    );
}

// 별점 보여주기
export function StarRating({ value, count }) {
    return (
        <span className="stars" aria-label={`평점 ${value}점`}>
            {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} size={14} className={n <= Math.round(value) ? 'star on' : 'star'} />
            ))}
            <span className="stars-text">
                {value > 0 ? value.toFixed(1) : '-'}
                {count !== undefined && ` (${count})`}
            </span>
        </span>
    );
}

// 별점 입력 (별을 누르면 onChange(점수) 호출)
export function StarInput({ value, onChange }) {
    return (
        <div className="star-input">
            {[1, 2, 3, 4, 5].map(n => (
                <button type="button" key={n} aria-label={`${n}점`}
                    className={n <= value ? 'on' : ''} onClick={() => onChange(n)}>
                    <Star size={22} />
                </button>
            ))}
        </div>
    );
}

// 삭제 확인 버튼 (한 번 누르면 confirmLabel 버튼으로 바뀌고, 한 번 더 눌러야 실행)
export function ConfirmButton({ onConfirm, label, icon, className = 'btn btn-danger btn-sm', confirmLabel = '정말 삭제할까요?' }) {
    const [asking, setAsking] = useState(false);

    // 3초 안에 다시 누르지 않으면 원래대로
    useEffect(() => {
        if (!asking) return;
        const timeId = setTimeout(() => setAsking(false), 3000);
        return () => clearTimeout(timeId);
    }, [asking]);

    if (asking) {
        return (
            <span className="confirm-group">
                <button type="button" className="btn btn-danger btn-sm"
                    onClick={() => { setAsking(false); onConfirm(); }}>{confirmLabel}</button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAsking(false)}>취소</button>
            </span>
        );
    }
    return <button type="button" className={className} onClick={() => setAsking(true)}>{icon}{label}</button>;
}

// 내용이 없을 때 안내
export function EmptyState({ title, children }) {
    return (
        <div className="empty-state">
            <p className="empty-title">{title}</p>
            {children}
        </div>
    );
}

// 페이지 제목 (브라우저 탭 제목도 같이 변경)
export function PageTitle({ title, sub }) {
    useEffect(() => {
        document.title = `${title} | GameVault`;
    }, [title]);

    return (
        <div className="page-title">
            <h1>{title}</h1>
            {sub && <p className="muted">{sub}</p>}
        </div>
    );
}
