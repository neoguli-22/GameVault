// StorePage.jsx - 게임 목록 검색 / 필터 / 정렬 / 더 보기
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RotateCcw, Search } from 'lucide-react';
import { GENRES, PLATFORMS } from '../utils/constants';
import { useStore } from '../context/StoreContext';
import { getSalePrice } from '../utils/price';
import GameGrid from '../components/GameGrid';
import { EmptyState, PageTitle } from '../components/common';

const PAGE_SIZE = 16;   // 한 번에 보여줄 게임 수

const SORT_OPTIONS = [
    { value: 'popular', label: '리뷰 많은순' },
    { value: 'newest', label: '최신 출시순' },
    { value: 'priceAsc', label: '낮은 가격순' },
    { value: 'priceDesc', label: '높은 가격순' },
    { value: 'discount', label: '할인율 높은순' },
    { value: 'title', label: '이름순' },
];

export default function StorePage() {
    const { games, reviews } = useStore();
    const params = useParams();   // /store/RPG 로 들어오면 params.genre === 'RPG'

    // 검색 조건 상태
    const [keyword, setKeyword] = useState('');
    const [genre, setGenre] = useState(params.genre || '');
    const [platform, setPlatform] = useState('');
    const [sort, setSort] = useState('popular');
    const [saleOnly, setSaleOnly] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);   // 화면에 보여줄 개수

    // 주소의 장르가 바뀌면 장르 필터도 바꾸기
    useEffect(() => {
        setGenre(params.genre || '');
    }, [params.genre]);

    // 검색 조건이 바뀌면 다시 처음 16개부터 보여주기
    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [keyword, genre, platform, sort, saleOnly]);

    // 1) 조건에 맞는 게임만 고르기
    const q = keyword.trim().toLowerCase();
    const filtered = games.filter(g =>
        (q === '' || g.title.toLowerCase().includes(q) || g.developer.toLowerCase().includes(q))
        && (genre === '' || g.genre === genre)
        && (platform === '' || g.platforms.includes(platform))
        && (!saleOnly || g.discountRate > 0));

    // 2) 정렬하기
    const reviewCount = (id) => reviews.filter(r => r.gameId === id).length;
    filtered.sort((a, b) => {
        if (sort === 'newest') return b.releaseDate.localeCompare(a.releaseDate);
        if (sort === 'priceAsc') return getSalePrice(a) - getSalePrice(b);
        if (sort === 'priceDesc') return getSalePrice(b) - getSalePrice(a);
        if (sort === 'discount') return b.discountRate - a.discountRate;
        if (sort === 'title') return a.title.localeCompare(b.title);
        return reviewCount(b.id) - reviewCount(a.id);   // 리뷰 많은순
    });

    const hasFilter = keyword || genre || platform || saleOnly || sort !== 'popular';

    // 초기화 버튼
    const resetFilters = () => {
        setKeyword('');
        setGenre('');
        setPlatform('');
        setSort('popular');
        setSaleOnly(false);
    };

    return (
        <>
            <PageTitle title="스토어" sub="제목 또는 개발사로 검색하고, 장르·플랫폼으로 원하는 게임을 찾아보세요." />

            <div className="filter-bar card">
                <label className="search-box">
                    <Search size={18} />
                    <input type="search" placeholder="게임 제목 또는 개발사 검색" value={keyword}
                        onChange={e => setKeyword(e.target.value)} aria-label="게임 검색" />
                </label>
                <select value={genre} onChange={e => setGenre(e.target.value)} aria-label="장르 필터">
                    <option value="">전체 장르</option>
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select value={platform} onChange={e => setPlatform(e.target.value)} aria-label="플랫폼 필터">
                    <option value="">전체 플랫폼</option>
                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={sort} onChange={e => setSort(e.target.value)} aria-label="정렬">
                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <label className="check">
                    <input type="checkbox" checked={saleOnly} onChange={e => setSaleOnly(e.target.checked)} />
                    할인 중만
                </label>
                {hasFilter && (
                    <button className="btn btn-ghost btn-sm" onClick={resetFilters}>
                        <RotateCcw size={14} /> 초기화
                    </button>
                )}
            </div>

            <p className="result-count" data-testid="result-count">검색 결과 <b>{filtered.length}</b>개</p>

            {filtered.length === 0 ? (
                <EmptyState title="조건에 맞는 게임이 없습니다.">
                    <p className="muted">검색어나 필터를 변경해 보세요.</p>
                </EmptyState>
            ) : (
                <>
                    {/* 앞에서부터 visibleCount 개만 보여주기 */}
                    <GameGrid games={filtered.slice(0, visibleCount)} />
                    {visibleCount < filtered.length && (
                        <div className="load-more">
                            <button className="btn btn-ghost" onClick={() => setVisibleCount(visibleCount + PAGE_SIZE)}>
                                게임 더 보기 ({visibleCount} / {filtered.length})
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
