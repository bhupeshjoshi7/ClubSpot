import { setallClubs } from '@/redux/clubSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { JOB_API_END_POINT } from '@/utils/constant'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getAllJobs`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setallClubs(res.data.jobs));
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchAllJobs();
    }, [dispatch])
}

export default useGetAllJobs;
