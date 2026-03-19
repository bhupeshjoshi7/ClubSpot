import React from 'react'
import { Badge } from './ui/badge'

const LatestClubCard = ({ job: club }) => {

  return (
    <div className='rounded-md shadow-xl mx-1 border border-gray-200 p-5 gap-3 cursor-pointer'>
      <div className='flex items-center gap-3'>
        <div className='h-12 w-12 rounded-lg overflow-hidden'>
          <img src={club?.logo} className='object-cover h-full w-full' alt={club?.name} />
        </div>
        <div>
          <h1 className='font-medium text-lg '>{club?.name}</h1>
          <p className='text-sm text-gray-500'>India</p>
        </div>
      </div>
      <div className='my-3'>
        <p className='text-sm line-clamp-2'> {club?.description || "Explore amazing opportunities and be part of a vibrant community."}</p>
      </div>
      <div className='flex items-center gap-2 mt-4'>
        <Badge className="text-blue-700 font-bold" variant={"ghost"}>Open for all</Badge>
        <Badge className="text-red-700 font-bold" variant={"ghost"}> Active</Badge>
      </div>
    </div>
  )
}

export default LatestClubCard