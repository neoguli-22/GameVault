// DealCard.jsx - CheapShark API 할인 정보 카드 1개
import { ExternalLink } from 'lucide-react';
import { dealLink } from '../api/gameApi';
import { formatKRW, usdToKrw } from '../utils/price';

// currency: 'KRW'(원화) 또는 'USD'(달러)
export default function DealCard({ deal, storeName, krwRate, currency }) {
    const savings = Math.round(parseFloat(deal.savings));        // 할인율 ("66.73" → 67)
    const metacritic = parseInt(deal.metacriticScore, 10);       // 메타크리틱 점수

    return (
        <article className="deal-card" data-testid="deal-card">
            <div className="deal-thumb">
                <img src={deal.thumb} alt={`${deal.title} 썸네일`} />
                {savings > 0 && <span className="discount">-{savings}%</span>}
            </div>
            <div className="deal-body">
                <h3 className="deal-title">{deal.title}</h3>
                <p className="muted small">{storeName}</p>
                <div className="deal-scores">
                    {metacritic > 0 && <span className="chip">MC {metacritic}</span>}
                    {deal.steamRatingText && <span className="chip">{deal.steamRatingText} {deal.steamRatingPercent}%</span>}
                </div>
                {/* 단위 환산: 선택한 단위에 따라 다르게 보여주기 (수업 Unit.jsx 의 삼항 연산자 방식) */}
                {currency === 'KRW' ? (
                    <div className="deal-price">
                        <span className="original">{formatKRW(usdToKrw(deal.normalPrice, krwRate))}</span>
                        <span className="sale">{formatKRW(usdToKrw(deal.salePrice, krwRate))}</span>
                        <span className="muted small">(${deal.salePrice})</span>
                    </div>
                ) : (
                    <div className="deal-price">
                        <span className="original">${deal.normalPrice}</span>
                        <span className="sale">${deal.salePrice}</span>
                        <span className="muted small">약 {formatKRW(usdToKrw(deal.salePrice, krwRate))}</span>
                    </div>
                )}
            </div>
            <div className="deal-actions">
                <a className="btn btn-primary btn-sm" href={dealLink(deal.dealID)} target="_blank" rel="noreferrer">
                    구매처 이동 <ExternalLink size={14} />
                </a>
            </div>
        </article>
    );
}
