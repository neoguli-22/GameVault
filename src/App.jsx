// App.jsx - 전역 Provider 감싸기 + 페이지 주소(라우팅) 설정
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { StoreProvider } from './context/StoreContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import GameDetailPage from './pages/GameDetailPage';
import DealsPage from './pages/DealsPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

export default function App() {
    return (
        <ThemeProvider>                 {/* 라이트/다크 테마 */}
            <ToastProvider>             {/* 알림 메시지 */}
                <StoreProvider>         {/* 게임·리뷰·주문 데이터 */}
                    <CartProvider>      {/* 장바구니 (게임 정보가 필요해서 StoreProvider 안쪽) */}
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Layout />}>
                                    <Route index element={<HomePage />} />
                                    <Route path="store" element={<StorePage />} />
                                    <Route path="store/:genre" element={<StorePage />} />
                                    <Route path="games/:gameId" element={<GameDetailPage />} />
                                    <Route path="deals" element={<DealsPage />} />
                                    <Route path="cart" element={<CartPage />} />
                                    <Route path="admin" element={<AdminPage />} />
                                    <Route path="*" element={<NotFoundPage />} />
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </CartProvider>
                </StoreProvider>
            </ToastProvider>
        </ThemeProvider>
    );
}
