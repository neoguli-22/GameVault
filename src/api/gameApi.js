// gameApi.js - 외부 Open API 호출
// 1) CheapShark API : PC 게임 실시간 할인 정보 (API Key 필요 없음) https://apidocs.cheapshark.com
// 2) ExchangeRate API : 달러 → 원 환율 (API Key 필요 없음)        https://www.exchangerate-api.com/docs/free

const CHEAPSHARK_URL = 'https://www.cheapshark.com/api/1.0';
const EXCHANGE_URL = 'https://open.er-api.com/v6/latest/USD';
export const DEFAULT_KRW_RATE = 1400;   // 환율 API 가 실패하면 쓰는 기본 환율

// 할인 목록 가져오기
// query = { title, sortBy, storeID, upperPrice, pageSize }
export async function fetchDeals(query) {
    const params = new URLSearchParams({
        sortBy: query.sortBy,
        pageSize: String(query.pageSize),
        onSale: '1',
    });
    if (query.title.trim()) params.set('title', query.title.trim());   // 검색어
    if (query.storeID) params.set('storeID', query.storeID);            // 스토어 (없으면 전체)
    if (query.upperPrice > 0) params.set('upperPrice', String(query.upperPrice));   // 최대 가격(달러)
    if (query.sortBy === 'Price' || query.sortBy === 'Title') params.set('desc', '0'); // 오름차순

    const response = await fetch(`${CHEAPSHARK_URL}/deals?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`할인 정보를 가져올 수 없습니다. (HTTP ${response.status})`);
    }
    return await response.json();
}

// 스토어 목록 가져오기 (스토어 번호 → 이름으로 바꿀 때 사용)
export async function fetchStores() {
    const response = await fetch(`${CHEAPSHARK_URL}/stores`);
    if (!response.ok) throw new Error('스토어 목록을 가져올 수 없습니다.');
    const data = await response.json();
    return data.filter(store => store.isActive === 1);   // 운영 중인 스토어만
}

// 달러 → 원 환율 가져오기 (실패하면 기본값)
export async function fetchKrwRate() {
    try {
        const response = await fetch(EXCHANGE_URL);
        if (!response.ok) return DEFAULT_KRW_RATE;
        const data = await response.json();
        return data.rates?.KRW || DEFAULT_KRW_RATE;
    } catch {
        return DEFAULT_KRW_RATE;
    }
}

// 할인 상품 구매 페이지 주소
export const dealLink = (dealID) => `https://www.cheapshark.com/redirect?dealID=${encodeURIComponent(dealID)}`;
