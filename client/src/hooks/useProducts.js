import { useState, useEffect, useCallback, useRef } from 'react';
import { productApi, getErrorMessage } from '../services/api';

const useProducts = ({ search = '', status = 'all', sort = '', debounceMs = 300 } = {}) => {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const debounceRef = useRef(null);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLoading(true);
      setError('');
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (status && status !== 'all') params.status = status;
      if (sort) params.sort = sort;

      productApi
        .getProducts(params)
        .then((res) => {
          setProducts(res.data.data);
          setSummary(res.data.summary);
        })
        .catch((err) => setError(getErrorMessage(err, 'Could not load products')))
        .finally(() => setLoading(false));
    }, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, status, sort, reloadKey, debounceMs]);

  return { products, summary, loading, error, reload };
};

export default useProducts;
