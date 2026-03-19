import React from 'react'
import { Navbar } from '../shared/Navbar'
import Home from '../Home'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import AdminClubPosition from './AdminClubPosition'

const Position = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar></Navbar>
      <div className="max-w-6xl mx-auto my-10">
        <div className='flex justify-end'>
          <Button onClick={() => navigate("/admin/jobs/create")}>New Position</Button>
        </div>
        <AdminClubPosition></AdminClubPosition>

      </div>

    </div>
  )
}

export default Position