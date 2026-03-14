
import { useEffect, useState } from 'react';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '../utils/constant';

const useGetApplicants = (jobId) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) return;
      setLoading(true);
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, { withCredentials: true });
        setApplicants(res.data.job.applications);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  return { applicants, loading, error, setApplicants };
};

export default useGetApplicants;
