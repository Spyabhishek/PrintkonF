import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Simple data fetch hook. Use for quick components.
 * @param {string} url
 * @param {object} opts axios options
 */
export default function useFetch(url, opts = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(Boolean(url));
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;
        let mounted = true;
        (async () => {
            try {
                const res = await axios.get(url, opts);
                if (mounted) setData(res.data);
            } catch (err) {
                if (mounted) setError(err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => (mounted = false);
    }, [url]);

    return { data, loading, error };
}
