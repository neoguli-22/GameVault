// validation.js - 입력값 검사. 오류가 있으면 { 필드이름: '오류 메시지' } 객체를 돌려준다.
import { LIMITS } from './constants';

// 게임 등록/수정 검사. editingId 가 있으면(수정 중) 자기 자신은 중복 검사에서 빼기
export function validateGame(input, games, editingId = null) {
    const errors = {};
    const title = input.title.trim();

    if (!title) {
        errors.title = '게임 제목을 입력하세요.';
    } else if (title.length > LIMITS.TITLE_MAX) {
        errors.title = `제목은 ${LIMITS.TITLE_MAX}자 이하로 입력하세요.`;
    } else if (games.some(g => g.id !== editingId && g.title.toLowerCase() === title.toLowerCase())) {
        errors.title = '이미 등록된 게임 제목입니다.';
    }

    if (!input.developer.trim()) errors.developer = '개발사를 입력하세요.';

    if (!Number.isInteger(input.price) || input.price < 0 || input.price > LIMITS.PRICE_MAX) {
        errors.price = `가격은 0 ~ ${LIMITS.PRICE_MAX.toLocaleString()}원 사이의 정수로 입력하세요.`;
    }

    if (!Number.isInteger(input.discountRate) || input.discountRate < 0 || input.discountRate > LIMITS.DISCOUNT_MAX) {
        errors.discountRate = `할인율은 0 ~ ${LIMITS.DISCOUNT_MAX}% 사이의 정수로 입력하세요.`;
    }

    if (input.platforms.length === 0) errors.platforms = '플랫폼을 1개 이상 선택하세요.';

    if (!input.releaseDate) errors.releaseDate = '출시일을 선택하세요.';

    const desc = input.description.trim();
    if (desc.length < LIMITS.DESC_MIN || desc.length > LIMITS.DESC_MAX) {
        errors.description = `게임 설명은 ${LIMITS.DESC_MIN} ~ ${LIMITS.DESC_MAX}자로 입력하세요.`;
    }

    const url = input.imageUrl.trim();
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        errors.imageUrl = '이미지 주소는 http:// 또는 https:// 로 시작해야 합니다.';
    }
    return errors;
}

// 리뷰 검사
export function validateReview(input) {
    const errors = {};
    const author = input.author.trim();
    const content = input.content.trim();

    if (!author) errors.author = '닉네임을 입력하세요.';
    else if (author.length > LIMITS.AUTHOR_MAX) errors.author = `닉네임은 ${LIMITS.AUTHOR_MAX}자 이하로 입력하세요.`;

    if (input.rating < 1 || input.rating > 5) errors.rating = '평점을 선택하세요.';

    if (content.length < LIMITS.REVIEW_MIN) errors.content = `리뷰는 ${LIMITS.REVIEW_MIN}자 이상 입력하세요.`;
    else if (content.length > LIMITS.REVIEW_MAX) errors.content = `리뷰는 ${LIMITS.REVIEW_MAX}자 이하로 입력하세요.`;
    return errors;
}

// 주문 정보 검사
export function validateCheckout(input) {
    const errors = {};
    if (!input.buyer.trim()) errors.buyer = '구매자 이름을 입력하세요.';
    // 이메일 형식: 글자@글자.글자
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) errors.email = '올바른 이메일 주소를 입력하세요.';
    return errors;
}

// 오류가 하나라도 있는지
export function hasErrors(errors) {
    return Object.keys(errors).length > 0;
}
