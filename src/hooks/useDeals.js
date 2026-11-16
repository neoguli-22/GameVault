// useDeals.js - CheapShark API 데이터를 가져오는 커스텀 훅
// 수업 예제 FetchData.jsx 와 같은 구조 (loading / error / data + isCancelled)
import { useEffect, useState } from 'react';
import { DEFAULT_KRW_RATE, fetchDeals, fetchKrwRate, fetchStores } from '../api/gameApi';

export function useDeals(title, sortBy, storeID, upperPrice, pageSize, reloadKey) {
    const [deals, setDeals] = useState([]);        // 정상으로 가져온 데이터 (Fulfilled)
    const [loading, setLoading] = useState(true);  // 요청하고 기다리는 중 (Pending)
    const [error, setError] = useState(null);      // 오류 (Rejected)

    useEffect(() => {
        let isCancelled = false;   // 이전 요청 결과가 늦게 와도 무시하기 위한 변수

        const loadDeals = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchDeals({ title, sortBy, storeID, upperPrice, pageSize });
                if (!isCancelled) setDeals(data);
            } catch (err) {
                if (!isCancelled) {
                    setDeals([]);
                    setError(err.message);
                }
            } finally {
                if (!isCancelled) setLoading(false);
            }
        };
        loadDeals();

        return () => {
            isCancelled = true;   // 조건이 바뀌면 이전 요청은 취소 처리
        };
    }, [title, sortBy, storeID, upperPrice, pageSize, reloadKey]);

    return { deals, loading, error };
}

// 스토어 이름 목록과 환율을 처음 한 번만 가져오는 훅
export function useDealMeta() {
    const [stores, setStores] = useState([]);
    const [krwRate, setKrwRate] = useState(DEFAULT_KRW_RATE);

    useEffect(() => {
        fetchStores()
            .then(data => setStores(data))
            .catch(() => {});   // 스토어 이름을 못 가져와도 번호로 표시하면 되므로 무시
        fetchKrwRate().then(rate => setKrwRate(rate));
    }, []);

    // 스토어 번호 → 이름
    const storeName = (id) => {
        const store = stores.find(s => s.storeID === id);
        return store ? store.storeName : `Store #${id}`;
    };
    const rateLive = krwRate !== DEFAULT_KRW_RATE;   // 실제 환율을 받아왔는지

    return { stores, krwRate, rateLive, storeName };
}
