// Layout.jsx - 모든 페이지 공통 화면 (Header + 페이지 내용(Outlet) + Footer)
import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Gamepad2, Menu, Moon, ShoppingCart, Sun, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

const MENUS = [
    { to: '/', label: '홈' },
    { to: '/store', label: '스토어' },
    { to: '/deals', label: '실시간 할인' },
    { to: '/admin', label: '게임 관리' },
];

function Header() {
    const { theme, toggleTheme } = useTheme();
    const { cartCount } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);   // 모바일 메뉴 열림 여부

    return (
        <header className="header">
            <div className="container header-inner">
                <Link to="/" className="logo" aria-label="GameVault 홈">
                    <Gamepad2 size={26} />
                    <span>Game<b>Vault</b></span>
                </Link>

                <nav className={menuOpen ? 'nav open' : 'nav'}>
                    {MENUS.map(menu => (
                        <NavLink key={menu.to} to={menu.to} end={menu.to === '/'}
                            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                            onClick={() => setMenuOpen(false)}>   {/* 메뉴를 누르면 모바일 메뉴 닫기 */}
                            {menu.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="header-actions">
                    <NavLink to="/cart" className="icon-btn" aria-label={`장바구니 ${cartCount}개`}
                        onClick={() => setMenuOpen(false)}>
                        <ShoppingCart size={20} />
                        {cartCount > 0 && <span className="badge" data-testid="cart-count">{cartCount}</span>}
                    </NavLink>
                    <button className="icon-btn" onClick={toggleTheme}
                        aria-label={theme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경'}>
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button className="icon-btn menu-toggle" onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="메뉴 열기" aria-expanded={menuOpen}>
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <p><b>GameVault</b> · 리액트 웹서비스 프로그래밍 과제</p>
                <p className="muted">
                    실시간 할인 정보: <a href="https://www.cheapshark.com" target="_blank" rel="noreferrer">CheapShark API</a> ·
                    환율 정보: <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">ExchangeRate-API</a>
                </p>
                <p className="muted">상점 데이터는 브라우저 LocalStorage에 저장되며 실제 결제는 이루어지지 않습니다.</p>
            </div>
        </footer>
    );
}

export default function Layout() {
    return (
        <div className="app">
            <Header />
            <main className="container main">
                <Outlet />  {/* 각 페이지 컴포넌트가 여기에 표시됨 */}
            </main>
            <Footer />
        </div>
    );
}
