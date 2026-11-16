# GameVault 🎮 — 게임 판매 및 정보 제공 웹서비스

리액트 웹서비스 프로그래밍 과제 · 생성형 AI 기반 바이브 코딩

게임 정보와 리뷰를 확인하고 장바구니로 주문하며, PC 게임은 **CheapShark Open API**로 여러 스토어의 실시간 할인 가격을 **원화로 환산**해 비교하는 React(JSX) 웹서비스입니다.

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
npm install      # 패키지 설치 (처음 한 번)
npm run dev      # 개발 서버 실행 → http://localhost:5173
npm run build    # 배포용 빌드(dist 폴더)
```

## 주요 기능

| 구분 | 기능 |
| --- | --- |
| 스토어 | 게임 52개, 제목·개발사 검색, 장르·플랫폼·할인 필터, 6가지 정렬, 16개씩 더 보기 |
| 게임 상세 | 상세 정보, 평균 평점, **리뷰 등록·조회·수정·삭제** |
| 장바구니·주문 | 담기, 수량 1~5(수량 1에서 − 누르면 삭제), 금액 자동 계산, 주문 입력 검사, 주문 완료 화면 |
| 게임 관리 | 게임 **등록·수정·삭제·검색**, 입력 검사, 초기 데이터 복원 |
| 실시간 할인 (Open API) | CheapShark 할인 검색(디바운스)·스토어·정렬·가격 필터, 환율 API로 원화 환산, **원화/달러 단위 전환** |
| 기타 | 라이트/다크 테마, 반응형(모바일 햄버거 메뉴), 토스트 알림, LocalStorage 저장 |

## 사용한 React 기술

| 기술 | 사용 위치 |
| --- | --- |
| useState | 폼 입력, 검색 조건, 리뷰·주문, 더 보기 개수, 가격 단위 |
| useEffect | LocalStorage 저장, API 호출(클린업으로 이전 요청 무시), 토스트 타이머 |
| useReducer | 게임 목록(StoreContext), 장바구니(CartContext, 수업 예제와 같은 ADD_ITEM / REMOVE_ITEM / CLEAR_CART) |
| useContext | 테마, 토스트, 상점 데이터, 장바구니 전역 상태 |
| useRef | 입력 오류 칸 포커스, 리뷰 수정 시 닉네임 칸 포커스 |
| 커스텀 Hook | useDebounce, useDeals, useDealMeta |
| JSX 조건부 렌더링 | 삼항 연산자(원화/달러, 빈 목록, 주문 완료), `&&`(할인 배지·오류 메시지), `map` + `key` |
| react-router-dom | BrowserRouter, 중첩 Route + Outlet, NavLink, useParams, useNavigate |

## 폴더 구조

```
src/
├─ api/gameApi.js          # CheapShark·환율 Open API 호출
├─ components/             # Layout, GameCard, GameGrid, GameForm, ReviewSection, DealCard, common
├─ context/                # ThemeContext, ToastContext, StoreContext, CartContext
├─ data/initialData.js     # 기본 게임 52개(Steam 대표 이미지), 샘플 리뷰 10개
├─ hooks/                  # useDebounce, useDeals
├─ pages/                  # Home, Store, GameDetail, Deals, Cart, Admin, NotFound
├─ utils/                  # constants, price, storage, validation, reducers
├─ App.jsx / main.jsx / App.css
```

## 외부 Open API

| API | 용도 | 비고 |
| --- | --- | --- |
| [CheapShark API](https://apidocs.cheapshark.com/) | PC 게임 할인 목록, 스토어 목록 | API Key 불필요 |
| [ExchangeRate-API (open.er-api.com)](https://www.exchangerate-api.com/docs/free) | USD → KRW 환율 | API Key 불필요, 실패 시 1,400원 |

> 학습용 프로젝트로 실제 결제는 이루어지지 않으며, 데이터는 브라우저 LocalStorage에 저장됩니다.
