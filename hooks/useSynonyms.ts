import { useEffect, useState } from "react";

export default function useSynonyms() {
    const [synonyms, setSynonyms] = useState<{ [key: string]: any }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadSynonyms = async () => {
            try {
                const res = await fetch("/synonyms.json"); // Load from /public
                const data = await res.json();
                setSynonyms(data);
            } catch (err) {
                setError("Failed to load synonyms.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadSynonyms();
    }, []);

    return { synonyms, loading, error };
}
