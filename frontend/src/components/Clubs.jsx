import React from "react";
import { Navbar } from "./shared/Navbar";
import Club from "./Club";
import { useSelector } from "react-redux";
import useGetAllClubs from "@/hooks/useGetAllClubs";

const Clubs = () => {
  useGetAllClubs();
  const { allClubs } = useSelector((store) => store.club);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-blue-700">
          Explore Our Clubs
        </h1>
        <div className="flex gap-5">
          {allClubs.length <= 0 ? (
            <span className="text-center text-lg text-gray-500">Club Not Found</span>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
              {/* Responsive Grid Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allClubs.map((club) => (
                  <div key={club._id} className="transition-transform transform hover:scale-105">
                    <Club job={club} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clubs;