// NotFoundPage.jsx - 없는 주소로 들어왔을 때 (404)
import { Link } from 'react-router-dom';
import { EmptyState, PageTitle } from '../components/common';

export default function NotFoundPage() {
    return (
        <>
            <PageTitle title="페이지를 찾을 수 없습니다" />
            <EmptyState title="404 - 요청한 페이지가 존재하지 않습니다.">
                <Link to="/" className="btn btn-primary">홈으로 이동</Link>
            </EmptyState>
        </>
    );
}
