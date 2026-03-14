import React, { useState } from "react";
import { Navbar } from "./shared/Navbar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Pen } from "lucide-react";
import AppliedClubsTable from "./AppliedClubsTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import store from "@/redux/store";

const Profile = () => {
  const [open, setOpen]= useState(false);
  const {user}= useSelector(store=>store.auth)
  return (
    <div>
  <Navbar />
  <div className="max-w-3xl shadow-lg rounded-2xl border border-gray-200 p-10 my-10 mx-auto bg-white">
    <div className="flex justify-between items-start">
      {/* Profile Avatar and Details */}
      <div className="flex gap-8 items-center p-5 relative">
        {/* Avatar with Background and Edit Icon */}
        <div className="relative">
          <div className="h-28 w-28 rounded-full border-4 border-indigo-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-lg">
            <Avatar className="relative h-full w-full rounded-full overflow-hidden">
              <AvatarImage
                className="object-cover w-full h-full rounded-full"
                src={user?.profile?.profilePhoto}
                alt="User Profile Photo"
              />
            </Avatar>
          </div>
          <div
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Pen className="h-5 w-5 text-indigo-600" />
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-800">{user?.fullname}</h1>
          <p className="text-lg text-gray-600">{user?.email}</p>
          <p className="text-gray-500 italic">{user?.profile?.bio || "Bio not provided"}</p>
          <p className="text-gray-600 capitalize font-semibold">
            Role: {user?.role}
          </p>
          <p className="text-gray-600">Phone: {user?.phoneNumber}</p>
          <p className="text-gray-700">
            <span className="font-semibold">Skills:</span>{" "}
            {user?.profile?.skills.length > 0
              ? user?.profile?.skills.join(", ")
              : "No skills added"}
          </p>
        </div>
      </div>

      {/* Edit Button */}
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 bg-indigo-500 text-white hover:bg-indigo-600"
      >
        <Pen className="h-4 w-4" />
        <span>Edit Profile</span>
      </Button>
    </div>
  </div>

  {/* Update Profile Dialog */}
  <UpdateProfileDialog open={open} setOpen={setOpen} />
</div>

  );
};

export default Profile;
