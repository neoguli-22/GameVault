// AdminPage.jsx - 게임 관리 (등록 / 수정 / 삭제 / 검색)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, RotateCcw, Search, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { formatKRW, getSalePrice } from '../utils/price';
import GameForm, { EMPTY_GAME } from '../components/GameForm';
import { ConfirmButton, EmptyState, PageTitle } from '../components/common';

export default function AdminPage() {
    const { games, addGame, updateGame, deleteGame, resetGames } = useStore();
    const showToast = useToast();
    const [editingId, setEditingId] = useState(null);   // 수정 중인 게임 id (null 이면 새 게임 등록)
    const [keyword, setKeyword] = useState('');

    // 폼에 채울 값: 수정 중이면 그 게임, 아니면 빈 폼
    const editingGame = games.find(g => g.id === editingId);
    const formInitial = editingGame || EMPTY_GAME;

    // 관리 목록 검색 (제목 또는 개발사)
    const q = keyword.trim().toLowerCase();
    const filtered = games.filter(g => g.title.toLowerCase().includes(q) || g.developer.toLowerCase().includes(q));

    // 폼 제출: 등록 또는 수정
    const handleSubmit = (input) => {
        if (editingId === null) {
            const created = addGame(input);
            showToast(`"${created.title}" 게임을 등록했습니다.`);
        } else {
            updateGame(editingId, input);
            showToast('게임 정보를 수정했습니다.');
            setEditingId(null);
        }
    };

    // 수정 버튼: 폼에 게임 정보를 채우고 화면 맨 위로
    const startEdit = (game) => {
        setEditingId(game.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (game) => {
        deleteGame(game.id);
        if (editingId === game.id) setEditingId(null);
        showToast(`"${game.title}" 게임을 삭제했습니다.`, 'info');
    };

    const handleReset = () => {
        resetGames();
        setEditingId(null);
        showToast('초기 데이터로 복원했습니다.', 'info');
    };

    return (
        <>
            <PageTitle title="게임 관리" sub="스토어에 판매할 게임을 등록·수정·삭제합니다. 변경 내용은 LocalStorage에 저장됩니다." />

            <div className="admin-layout">
                <GameForm initialValue={formInitial} games={games} editingId={editingId}
                    onSubmit={handleSubmit} onCancel={() => setEditingId(null)} />

                <section className="card admin-list">
                    <div className="section-head">
                        <h2>등록된 게임 <span className="muted">({games.length})</span></h2>
                        <ConfirmButton label="초기 데이터 복원" confirmLabel="모든 변경 사항을 되돌릴까요?"
                            icon={<RotateCcw size={14} />} className="btn btn-ghost btn-sm" onConfirm={handleReset} />
                    </div>
                    <label className="search-box">
                        <Search size={18} />
                        <input type="search" placeholder="관리할 게임 검색" value={keyword}
                            onChange={e => setKeyword(e.target.value)} aria-label="관리 게임 검색" />
                    </label>

                    {filtered.length === 0 ? (
                        <EmptyState title="검색 결과가 없습니다." />
                    ) : (
                        <div className="table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr><th>제목</th><th>장르</th><th>정가</th><th>할인</th><th>판매가</th><th>관리</th></tr>
                                </thead>
                                <tbody>
                                    {filtered.map(game => (
                                        <tr key={game.id} className={editingId === game.id ? 'editing' : ''} data-testid="admin-row">
                                            <td><Link to={`/games/${game.id}`}>{game.title}</Link></td>
                                            <td>{game.genre}</td>
                                            <td>{formatKRW(game.price)}</td>
                                            <td>{game.discountRate}%</td>
                                            <td><b>{formatKRW(getSalePrice(game))}</b></td>
                                            <td className="actions">
                                                <button className="btn btn-ghost btn-sm" onClick={() => startEdit(game)}>
                                                    <Pencil size={14} />수정
                                                </button>
                                                <ConfirmButton label="삭제" icon={<Trash2 size={14} />} onConfirm={() => handleDelete(game)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
}
