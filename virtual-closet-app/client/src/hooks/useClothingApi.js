import { useEffect, useState } from "react";

export function useClothingApi(limit = 5) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/clothing?userId=virtual-closet-user`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items.slice(0, limit));
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [limit]);

  return { items, loading, error };
}
