import React from 'react';
import LatestClubCard from './LatestClubCard';
import { useSelector } from 'react-redux';

const LatestClubs = () => {
  const { allClubs } = useSelector((store) => store.club);

  return (
    <div className="mx-auto my-20 max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Latest & Top <span className="text-blue-700">Clubs Openings</span>
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        
{
          allClubs.length<=0 ? <span>NO Openings</span> : allClubs.slice(0,9).map((job)=> <LatestClubCard key={job._id} job={job} />
        )}
      </div>
    </div>
  );
};

export default LatestClubs;
