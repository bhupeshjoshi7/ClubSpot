import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Navigate, useNavigate } from "react-router-dom";

const Club = ({club}) => {
  const navigate=useNavigate();
  return (
    <div className="p-5 rounded-md shadow-xl bg-white border border-gray-100 mb-4 ml-4">
      <div className="flex items-center justify-between ">
        <p className="font-bold text-lg">{club?.name}</p>
      </div>
      <div className="flex items-center gap-2 my-2">
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={club?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className="text-xl font-bold">{club?.name}</h1>
                              <p className="text-md text-gray-600 font-serif">{club?.description?.substring(0,50) || 'No description'}...</p>
        </div>
        
      </div>
      <div className="text-sm text-gray-700">
        <p>{club?.description}</p>
      </div>
      <div className="flex mt-4 gap-4">
          <Button onClick={()=>navigate(`/description/${club?._id}`)} variant="outline">Details</Button>
        </div>
    </div>
  );
};

export default Club;
