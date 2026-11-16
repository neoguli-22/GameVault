// ReviewSection.jsx - 게임 상세 페이지의 리뷰 등록 / 목록(정렬) / 수정 / 삭제
import { useRef, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { hasErrors, validateReview } from '../utils/validation';
import { LIMITS } from '../utils/constants';
import { formatDateTime } from '../utils/price';
import { ConfirmButton, EmptyState, StarInput, StarRating } from './common';

const EMPTY_REVIEW = { author: '', rating: 0, content: '' };

export default function ReviewSection({ gameId }) {
    const { reviews, addReview, updateReview, deleteReview } = useStore();
    const showToast = useToast();
    const [form, setForm] = useState(EMPTY_REVIEW);
    const [errors, setErrors] = useState({});
    const [editingId, setEditingId] = useState(null);   // 수정 중인 리뷰 id (null 이면 새 리뷰 작성)
    const [sort, setSort] = useState('latest');          // 'latest' | 'high' | 'low'
    const authorRef = useRef(null);                      // 수정 버튼을 누르면 닉네임 칸으로 포커스

    // 이 게임의 리뷰만 골라서 정렬
    const gameReviews = reviews
        .filter(r => r.gameId === gameId)
        .sort((a, b) => {
            if (sort === 'high') return b.rating - a.rating;   // 평점 높은순
            if (sort === 'low') return a.rating - b.rating;    // 평점 낮은순
            return b.createdAt - a.createdAt;                  // 최신순
        });

    // 입력값이 바뀔 때 (name 속성으로 어떤 칸인지 구분)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();   // 새로고침 방지
        const result = validateReview(form);
        setErrors(result);
        if (hasErrors(result)) return;

        if (editingId === null) {
            addReview(gameId, form);
            showToast('리뷰를 등록했습니다.');
        } else {
            updateReview(editingId, form);
            showToast('리뷰를 수정했습니다.');
            setEditingId(null);
        }
        setForm(EMPTY_REVIEW);
    };

    // 수정 버튼: 폼에 기존 내용을 채우고 닉네임 칸으로 포커스
    const startEdit = (review) => {
        setEditingId(review.id);
        setForm({ author: review.author, rating: review.rating, content: review.content });
        setErrors({});
        authorRef.current.focus();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm(EMPTY_REVIEW);
        setErrors({});
    };

    const handleDelete = (id) => {
        deleteReview(id);
        if (editingId === id) cancelEdit();
        showToast('리뷰를 삭제했습니다.', 'info');
    };

    return (
        <section className="review-section">
            <div className="section-head">
                <h2>사용자 리뷰 <span className="muted">({gameReviews.length})</span></h2>
                <select value={sort} onChange={e => setSort(e.target.value)} aria-label="리뷰 정렬">
                    <option value="latest">최신순</option>
                    <option value="high">평점 높은순</option>
                    <option value="low">평점 낮은순</option>
                </select>
            </div>

            <form className="review-form card" onSubmit={handleSubmit} noValidate>
                <h3>{editingId === null ? '리뷰 작성' : '리뷰 수정 중'}</h3>
                <div className="review-form-row">
                    <label className="field">
                        <span>닉네임</span>
                        <input ref={authorRef} name="author" value={form.author} placeholder="닉네임" onChange={handleChange} />
                        {errors.author && <p className="field-error">{errors.author}</p>}
                    </label>
                    <div className="field">
                        <span>평점</span>
                        <StarInput value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} />
                        {errors.rating && <p className="field-error">{errors.rating}</p>}
                    </div>
                </div>
                <label className="field">
                    <span>내용 ({form.content.trim().length}/{LIMITS.REVIEW_MAX})</span>
                    <textarea name="content" rows={3} value={form.content} onChange={handleChange}
                        placeholder="게임에 대한 솔직한 후기를 남겨주세요." />
                    {errors.content && <p className="field-error">{errors.content}</p>}
                </label>
                <div className="btn-row end">
                    {editingId !== null && <button type="button" className="btn btn-ghost" onClick={cancelEdit}>취소</button>}
                    <button type="submit" className="btn btn-primary">{editingId === null ? '리뷰 등록' : '수정 완료'}</button>
                </div>
            </form>

            {gameReviews.length === 0 ? (
                <EmptyState title="아직 리뷰가 없습니다. 첫 리뷰를 남겨보세요!" />
            ) : (
                <ul className="review-list">
                    {gameReviews.map(review => (
                        <li key={review.id} className={editingId === review.id ? 'review-item editing' : 'review-item'}
                            data-testid="review-item">
                            <div className="review-head">
                                <b>{review.author}</b>
                                <StarRating value={review.rating} />
                                <span className="muted small">
                                    {formatDateTime(review.createdAt)}
                                    {review.updatedAt && ' (수정됨)'}
                                </span>
                            </div>
                            <p className="review-content">{review.content}</p>
                            <div className="btn-row">
                                <button className="btn btn-ghost btn-sm" onClick={() => startEdit(review)}>
                                    <Pencil size={14} />수정
                                </button>
                                <ConfirmButton label="삭제" icon={<Trash2 size={14} />} className="btn btn-ghost btn-sm"
                                    onConfirm={() => handleDelete(review.id)} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
