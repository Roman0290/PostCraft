import { useSearchParams } from 'react-router-dom';

/** Keeps the current page number in the URL (?page=2) so it survives refresh/back. */
export default function usePageParam() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Number(params.get('page')) || 1);
  const setPage = (p) => {
    const next = new URLSearchParams(params);
    if (p > 1) next.set('page', p); else next.delete('page');
    setParams(next);
  };
  return [page, setPage];
}
