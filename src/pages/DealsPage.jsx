// DealsPage.jsx - 외부 Open API(CheapShark)로 PC 게임 실시간 할인 정보 검색
import { useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useDealMeta, useDeals } from '../hooks/useDeals';
import { formatKRW, usdToKrw } from '../utils/price';
import DealCard from '../components/DealCard';
import { EmptyState, PageTitle } from '../components/common';

const SORTS = [
    { value: 'Deal Rating', label: '추천순(딜 점수)' },
    { value: 'Savings', label: '할인율 높은순' },
    { value: 'Price', label: '낮은 가격순' },
    { value: 'Metacritic', label: '메타크리틱 점수순' },
    { value: 'Release', label: '최신 출시순' },
];
const PRICE_LIMITS = [0, 5, 10, 20, 40];   // 최대 가격(달러), 0 = 제한 없음

export default function DealsPage() {
    const [keyword, setKeyword] = useState('');
    const [sortBy, setSortBy] = useState('Deal Rating');
    const [storeID, setStoreID] = useState('1');       // 기본: Steam
    const [upperPrice, setUpperPrice] = useState(0);
    const [reloadKey, setReloadKey] = useState(0);     // 값이 바뀌면 다시 요청 (새로고침 / 다시 시도)
    const [currency, setCurrency] = useState('KRW');   // 가격 표시 단위: 'KRW' 또는 'USD'

    // 글자를 칠 때마다 요청하지 않도록 0.5초 동안 입력이 멈추면 검색
    const debouncedKeyword = useDebounce(keyword, 500);
    const { deals, loading, error } = useDeals(debouncedKeyword, sortBy, storeID, upperPrice, 24, reloadKey);
    const { stores, krwRate, rateLive, storeName } = useDealMeta();

    const reload = () => setReloadKey(reloadKey + 1);

    return (
        <>
            <PageTitle title="실시간 할인 정보" sub="CheapShark Open API로 Steam·GOG·Epic 등 여러 PC 게임 스토어의 할인 가격을 비교합니다." />

            <div className="filter-bar card">
                <label className="search-box">
                    <Search size={18} />
                    <input type="search" placeholder="영문 게임 제목 검색 (예: witcher)" value={keyword}
                        onChange={e => setKeyword(e.target.value)} aria-label="할인 게임 검색" />
                </label>
                <select value={storeID} onChange={e => setStoreID(e.target.value)} aria-label="스토어 선택">
                    <option value="">전체 스토어</option>
                    {stores.length === 0 && <option value="1">Steam</option>}
                    {stores.map(s => <option key={s.storeID} value={s.storeID}>{s.storeName}</option>)}
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} aria-label="할인 정렬">
                    {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                <select value={upperPrice} onChange={e => setUpperPrice(Number(e.target.value))} aria-label="최대 가격">
                    {PRICE_LIMITS.map(p => (
                        <option key={p} value={p}>
                            {p === 0 ? '가격 제한 없음'
                                : currency === 'KRW' ? `약 ${formatKRW(usdToKrw(p, krwRate))} 이하` : `$${p} 이하`}
                        </option>
                    ))}
                </select>
                {/* 원화 / 달러 단위 전환 (수업 Unit.jsx 의 단위 환산) */}
                <div className="segmented">
                    <button type="button" className={currency === 'KRW' ? 'seg active' : 'seg'} onClick={() => setCurrency('KRW')}>₩ 원화</button>
                    <button type="button" className={currency === 'USD' ? 'seg active' : 'seg'} onClick={() => setCurrency('USD')}>$ 달러</button>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={reload}>
                    <RefreshCw size={14} /> 새로고침
                </button>
            </div>

            <p className="muted small">
                적용 환율: 1 USD = {krwRate.toLocaleString('ko-KR', { maximumFractionDigits: 1 })}원
                {rateLive ? ' (실시간)' : ' (기본값 - 환율 API 연결 실패)'}
            </p>

            {loading && <p className="loading">할인 정보를 불러오는 중...</p>}
            {!loading && error && (
                <div className="error-box">
                    <p>{error}</p>
                    <p className="small">인터넷 연결을 확인한 후 다시 시도하세요.</p>
                    <button className="btn btn-primary btn-sm" onClick={reload}>다시 시도</button>
                </div>
            )}
            {!loading && !error && deals.length === 0 && (
                <EmptyState title="할인 중인 게임을 찾지 못했습니다.">
                    <p className="muted">검색어(영문)나 스토어, 가격 조건을 바꿔 보세요.</p>
                </EmptyState>
            )}
            {!loading && !error && deals.length > 0 && (
                <>
                    <p className="result-count" data-testid="deal-count">할인 게임 <b>{deals.length}</b>개</p>
                    <div className="deal-grid">
                        {deals.map(deal => (
                            <DealCard key={deal.dealID} deal={deal} storeName={storeName(deal.storeID)}
                                krwRate={krwRate} currency={currency} />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}
