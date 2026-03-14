
import { useState } from 'react';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';

const useUpdateApplicantStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = async (applicationId, status) => {
    setLoading(true);
    try {
      const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status }, { withCredentials: true });
      toast.success(res.data.message);
      return res.data.application;
    } catch (err) {
      setError(err);
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
};

export default useUpdateApplicantStatus;
