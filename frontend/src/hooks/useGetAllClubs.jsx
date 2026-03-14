import { setallClubs } from '@/redux/clubSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { CL_API_END_POINT } from '@/utils/constant'


const useGetAllClubs = () => {
  const dispatch=useDispatch();
  useEffect(() => {
    const fetchAllClubs= async ()=> {
        try{
            const res = await axios.get(`${CL_API_END_POINT}/all`);
            if(res.data.success){
                dispatch(setallClubs(res.data.companies));
            }
        }
        catch (error){
            console.log(error);
        }
    }
    fetchAllClubs();
  },[])
}

export default useGetAllClubs;