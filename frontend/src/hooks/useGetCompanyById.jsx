import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { CL_API_END_POINT } from '@/utils/constant'
import { setSingleCompany } from '@/redux/companySlice'


const useGetCompanyById = (companyId) => {
  const dispatch=useDispatch();
  useEffect(() => {
    const fetchSingleCLub= async ()=> {
        try{
            const res = await axios.get(`${CL_API_END_POINT}/get/${companyId}`,{withCredentials:true});
            if(res.data.success){
                dispatch(setSingleCompany(res.data.company));
            }
        }
        catch (error){
            console.log(error);
        }
    }
    fetchSingleCLub();
  },[companyId,dispatch])
}

export default useGetCompanyById;