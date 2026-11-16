// price.js - 가격 계산, 날짜 표시 함수

// 할인 적용 가격 (100원 단위 반올림)
export function getSalePrice(game) {
    const sale = game.price * (100 - game.discountRate) / 100;
    return Math.round(sale / 100) * 100;
}

// 숫자를 원화 형식으로 표시 (0원은 "무료")
export function formatKRW(value) {
    if (value === 0) return '무료';
    return value.toLocaleString('ko-KR') + '원';
}

// 달러를 원화로 바꾸기 (10원 단위 반올림)
export function usdToKrw(usd, rate) {
    const value = parseFloat(usd);   // API 가격은 "9.99" 같은 문자열
    if (isNaN(value)) return 0;
    return Math.round((value * rate) / 10) * 10;
}

// 리뷰 평균 평점 (리뷰가 없으면 0, 소수점 첫째 자리까지)
export function averageRating(reviews) {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
}

// 시간 값 → "2026-11-15" 형식
export function formatDate(time) {
    const d = new Date(time);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
}

// 시간 값 → "2026-11-15 13:05" 형식
export function formatDateTime(time) {
    const d = new Date(time);
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${formatDate(time)} ${hh}:${mi}`;
}
