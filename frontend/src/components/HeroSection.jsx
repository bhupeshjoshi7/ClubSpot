import React from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="text-center bg-gradient-to-r from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-8">
      {/* Explore Clubs Link */}
      <Link to="/clubs">
        <span className="inline-block px-6 py-2 mb-4 rounded-full bg-gray-100 text-red-600 font-medium transition duration-300 hover:bg-red-100">
          Explore all clubs here
        </span>
      </Link>

      {/* Main Heading */}
      <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold py-6 lg:py-10">
        Search, Explore & <br /> Find Your{" "}
        <span className="text-blue-800">Perfect Club</span>
      </h1>

      {/* Search Bar */}
      <div className="flex items-center w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[40%] shadow-lg border border-gray-200 pl-4 rounded-full mx-auto mt-8 bg-white">
        <input
          type="text"
          placeholder="Explore all clubs"
          className="w-full py-2 outline-none border-none text-gray-700 rounded-l-full"
        />
        <Button className="rounded-r-full bg-blue-700 text-white p-2 hover:bg-blue-800 transition duration-300">
          <Search className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
