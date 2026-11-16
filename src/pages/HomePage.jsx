// HomePage.jsx - 메인 화면 (이번 주 할인, 장르 바로가기, 할인 중, 신작, 실시간 할인 미리보기)
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GENRES } from '../utils/constants';
import { useStore } from '../context/StoreContext';
import { useDealMeta, useDeals } from '../hooks/useDeals';
import GameGrid from '../components/GameGrid';
import DealCard from '../components/DealCard';
import { GameCover, PageTitle } from '../components/common';
import { formatKRW, getSalePrice } from '../utils/price';

export default function HomePage() {
    const { games } = useStore();
    // 스팀(storeID 1) 할인 4개 가져오기
    const { deals, loading, error } = useDeals('', 'Deal Rating', '1', 0, 4, 0);
    const { krwRate, storeName } = useDealMeta();

    // 할인 중인 게임을 할인율 높은 순으로 정렬해서 4개
    const onSale = games.filter(g => g.discountRate > 0);
    const bestDiscount = [...onSale].sort((a, b) => b.discountRate - a.discountRate).slice(0, 4);
    // 출시일 최신 순으로 4개
    const newest = [...games].sort((a, b) => b.releaseDate.localeCompare(a.releaseDate)).slice(0, 4);
    const pick = bestDiscount[0];   // 이번 주 가장 큰 할인

    return (
        <>
            <div className="sr-only"><PageTitle title="홈" /></div>
            <section className="hero">
                <div className="hero-text">
                    <h1>오늘은 뭐 할까?</h1>
                    <p>리뷰를 읽어 보고, 스토어별 할인 가격을 비교하고, 마음에 들면 바로 장바구니에.
                        지금 <b>{onSale.length}개</b> 게임이 할인 중이에요.</p>
                    <div className="btn-row">
                        <Link to="/store" className="btn btn-primary">스토어 둘러보기 <ArrowRight size={16} /></Link>
                        <Link to="/deals" className="btn btn-ghost">스팀 할인 비교하기</Link>
                    </div>
                </div>
                {pick && (
                    <Link to={`/games/${pick.id}`} className="hero-pick">
                        <span className="sticker">-{pick.discountRate}%</span>
                        <GameCover game={pick} />
                        <p className="hero-pick-label">이번 주 가장 큰 할인</p>
                        <p className="hero-pick-title">{pick.title}</p>
                        <p className="hero-pick-price">
                            <span className="original">{formatKRW(pick.price)}</span> <b>{formatKRW(getSalePrice(pick))}</b>
                        </p>
                    </Link>
                )}
            </section>

            <section className="section">
                <h2 className="section-title">장르로 찾기</h2>
                <div className="genre-links">
                    {/* /store/RPG 처럼 이동 → 스토어에서 useParams 로 장르를 읽음 */}
                    {GENRES.map(g => <Link key={g} to={`/store/${g}`} className="genre-link">{g}</Link>)}
                </div>
            </section>

            <section className="section">
                <div className="section-head">
                    <h2 className="section-title">지금 할인 중</h2>
                    <Link to="/store" className="link">전체 보기</Link>
                </div>
                <GameGrid games={bestDiscount} />
            </section>

            <section className="section">
                <div className="section-head">
                    <h2 className="section-title">새로 나온 게임</h2>
                    <Link to="/store" className="link">전체 보기</Link>
                </div>
                <GameGrid games={newest} />
            </section>

            <section className="section">
                <div className="section-head">
                    <h2 className="section-title">스팀에서 지금 싼 게임</h2>
                    <Link to="/deals" className="link">더 보기</Link>
                </div>
                {loading && <p className="loading">실시간 할인 정보를 불러오는 중...</p>}
                {error && <p className="error-box">{error}</p>}
                {!loading && !error && (
                    <div className="deal-grid">
                        {deals.map(deal => (
                            <DealCard key={deal.dealID} deal={deal} storeName={storeName(deal.storeID)}
                                krwRate={krwRate} currency="KRW" />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
