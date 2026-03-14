
import { useEffect, useState } from 'react';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '../utils/constant';

const useGetAppliedClubs = () => {
  const [appliedClubs, setAppliedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppliedClubs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
        setAppliedClubs(res.data.application);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedClubs();
  }, []);

  return { appliedClubs, loading, error };
};

export default useGetAppliedClubs;
