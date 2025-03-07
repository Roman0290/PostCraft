import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../api/axios';

/**
 * Run an async loader and track { data, loading, error }.
 * Re-runs whenever `deps` change. Returns `reload` to fetch again manually.
 */
export default function useFetch(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null, status: null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps);

  const load = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    run()
      .then((data) => !cancelled && setState({ data, loading: false, error: null, status: 200 }))
      .catch((err) => !cancelled && setState({
        data: null, loading: false, error: getErrorMessage(err), status: err.response?.status,
      }));
    return () => { cancelled = true; };
  }, [run]);

  useEffect(load, [load]);

  return { ...state, setData: (data) => setState((s) => ({ ...s, data })), reload: load };
}
