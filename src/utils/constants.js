// constants.js - 여러 파일에서 같이 쓰는 값 모음

// 게임 장르와 플랫폼 목록
export const GENRES = ['액션', 'RPG', '어드벤처', '전략', '시뮬레이션', '스포츠', '레이싱', '퍼즐', '인디'];
export const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Switch'];

// 입력값 제한
export const LIMITS = {
    TITLE_MAX: 50,        // 게임 제목 최대 글자 수
    PRICE_MAX: 300000,    // 최대 가격(원)
    DISCOUNT_MAX: 90,     // 최대 할인율(%)
    DESC_MIN: 10,         // 게임 설명 최소 글자 수
    DESC_MAX: 500,
    AUTHOR_MAX: 20,       // 리뷰 닉네임 최대 글자 수
    REVIEW_MIN: 5,        // 리뷰 최소 글자 수
    REVIEW_MAX: 300,
    CART_QTY_MAX: 5,      // 장바구니 한 게임당 최대 수량
};

// LocalStorage 에 저장할 때 쓰는 키 이름
export const STORAGE_KEYS = {
    GAMES: 'gv_games',
    REVIEWS: 'gv_reviews',
    CART: 'gv_cart',
    ORDERS: 'gv_orders',
    THEME: 'gv_theme',
};
