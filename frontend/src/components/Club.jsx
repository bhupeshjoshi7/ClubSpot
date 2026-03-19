import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Navigate, useNavigate } from "react-router-dom";

const Club = ({ job: club }) => {
  const navigate = useNavigate();
  return (
    <div className="p-6 rounded-2xl shadow-sm bg-white border border-gray-100 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <Button className="h-12 w-12 rounded-xl border-gray-100 p-0 overflow-hidden" variant="outline" size="icon">
          <Avatar className="h-full w-full">
            <AvatarImage src={club?.logo} className="object-cover" />
          </Avatar>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{club?.name}</h1>
          <p className="text-sm text-blue-600 font-semibold">India</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {club?.description || "Join this club to explore amazing opportunities and be part of a vibrant community."}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={() => navigate(`/description/${club?._id}`)}
          variant="outline"
          className="w-full rounded-xl border-blue-100 text-blue-700 hover:bg-blue-50 font-bold"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default Club;
