// GameForm.jsx - 게임 등록 / 수정 폼 (게임 관리 페이지에서 사용)
import { useEffect, useRef, useState } from 'react';
import { GENRES, LIMITS, PLATFORMS } from '../utils/constants';
import { hasErrors, validateGame } from '../utils/validation';
import { formatKRW, getSalePrice } from '../utils/price';

// 빈 폼의 기본값
export const EMPTY_GAME = {
    title: '', genre: '액션', platforms: ['PC'], price: 0, discountRate: 0,
    developer: '', releaseDate: '', description: '', imageUrl: '',
};

// initialValue: 폼에 처음 채울 값, editingId: 수정 중인 게임 id (등록이면 null)
export default function GameForm({ initialValue, games, editingId, onSubmit, onCancel }) {
    const [form, setForm] = useState(initialValue);
    const [errors, setErrors] = useState({});
    const titleRef = useRef(null);   // 제목에 오류가 있으면 제목 칸으로 포커스

    // 수정할 게임이 바뀌면 폼 내용도 바꾸기
    useEffect(() => {
        setForm(initialValue);
        setErrors({});
    }, [initialValue]);

    // 입력 칸 공통 처리 (name 속성으로 어떤 칸인지 구분)
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'price' || name === 'discountRate') {
            setForm({ ...form, [name]: Number(value) });   // 숫자 칸은 숫자로 바꿔서 저장
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    // 플랫폼 체크박스: 있으면 빼고, 없으면 넣기
    const togglePlatform = (platform) => {
        const platforms = form.platforms.includes(platform)
            ? form.platforms.filter(p => p !== platform)
            : [...form.platforms, platform];
        setForm({ ...form, platforms });
    };

    const handleSubmit = (e) => {
        e.preventDefault();   // 새로고침 방지
        const result = validateGame(form, games, editingId);
        setErrors(result);
        if (hasErrors(result)) {
            if (result.title) titleRef.current.focus();
            return;
        }
        onSubmit({ ...form, developer: form.developer.trim(), description: form.description.trim(), imageUrl: form.imageUrl.trim() });
        if (editingId === null) setForm(EMPTY_GAME);   // 등록 후 폼 비우기
    };

    return (
        <form className="game-form card" onSubmit={handleSubmit} noValidate>
            <h2>{editingId === null ? '새 게임 등록' : '게임 정보 수정'}</h2>

            <div className="form-grid">
                <label className="field">
                    <span>게임 제목 *</span>
                    <input ref={titleRef} name="title" value={form.title} onChange={handleChange} placeholder="예) Elden Ring" />
                    {errors.title && <p className="field-error">{errors.title}</p>}
                </label>
                <label className="field">
                    <span>개발사 *</span>
                    <input name="developer" value={form.developer} onChange={handleChange} placeholder="예) FromSoftware" />
                    {errors.developer && <p className="field-error">{errors.developer}</p>}
                </label>
                <label className="field">
                    <span>장르 *</span>
                    <select name="genre" value={form.genre} onChange={handleChange}>
                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </label>
                <label className="field">
                    <span>출시일 *</span>
                    <input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} />
                    {errors.releaseDate && <p className="field-error">{errors.releaseDate}</p>}
                </label>
                <label className="field">
                    <span>정가(원) *</span>
                    <input type="number" name="price" min={0} step={100} value={form.price} onChange={handleChange} />
                    {errors.price && <p className="field-error">{errors.price}</p>}
                </label>
                <label className="field">
                    <span>할인율(%)</span>
                    <input type="number" name="discountRate" min={0} max={LIMITS.DISCOUNT_MAX} value={form.discountRate} onChange={handleChange} />
                    {errors.discountRate && <p className="field-error">{errors.discountRate}</p>}
                </label>
            </div>

            <fieldset className="field">
                <legend>플랫폼 *</legend>
                <div className="checkbox-row">
                    {PLATFORMS.map(p => (
                        <label key={p} className="check">
                            <input type="checkbox" checked={form.platforms.includes(p)} onChange={() => togglePlatform(p)} />
                            {p}
                        </label>
                    ))}
                </div>
                {errors.platforms && <p className="field-error">{errors.platforms}</p>}
            </fieldset>

            <label className="field">
                <span>게임 설명 * ({form.description.trim().length}/{LIMITS.DESC_MAX})</span>
                <textarea name="description" rows={4} value={form.description} onChange={handleChange}
                    placeholder={`게임을 소개하는 설명을 ${LIMITS.DESC_MIN}자 이상 입력하세요.`} />
                {errors.description && <p className="field-error">{errors.description}</p>}
            </label>

            <label className="field">
                <span>커버 이미지 주소 (선택)</span>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
                {errors.imageUrl && <p className="field-error">{errors.imageUrl}</p>}
            </label>

            <div className="form-footer">
                <p className="muted">판매가 미리보기: <b>{formatKRW(getSalePrice(form))}</b></p>
                <div className="btn-row">
                    {editingId !== null && <button type="button" className="btn btn-ghost" onClick={onCancel}>수정 취소</button>}
                    <button type="submit" className="btn btn-primary">{editingId === null ? '등록하기' : '수정 완료'}</button>
                </div>
            </div>
        </form>
    );
}
