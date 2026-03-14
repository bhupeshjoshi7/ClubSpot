import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

export const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto py-5 px-4 md:px-8 max-w-5xl">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            <Link to="/">
              ClubSpot
              <span className="text-red-600">PEC</span>
            </Link>
          </h1>
        </div>
        <div className="flex items-center gap-6 md:gap-12">
          <ul className="hidden md:flex font-medium text-lg items-center gap-6 md:gap-10">
            {user && user?.role === "recruiter" ? (
              <li>
                <Link to="/admin/position">Club Positions</Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/clubs">Clubs</Link>
                </li>
                <li>
                  <Link to="/appliedclubs">Applications</Link>
                </li>
              </>
            )}
          </ul>

          <div className="md:hidden">
            {/* Mobile Hamburger Menu */}
            <Popover>
              <PopoverTrigger>
                <Button variant="outline">Menu</Button>
              </PopoverTrigger>
              <PopoverContent className="z-50 bg-white shadow-lg rounded-lg p-4 w-48">
                <ul className="flex flex-col space-y-4">
                  {user && user?.role === "recruiter" ? (
                    <li>
                      <Link to="/admin/position">Club Positions</Link>
                    </li>
                  ) : (
                    <>
                      <li>
                        <Link to="/">Home</Link>
                      </li>
                      <li>
                        <Link to="/clubs">Clubs</Link>
                      </li>
                      <li>
                        <Link to="/appliedclubs">Applications</Link>
                      </li>
                    </>
                  )}
                </ul>
              </PopoverContent>
            </Popover>
          </div>

          {!user ? (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="outline" className="text-sm md:text-base">
                  LogIn
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-blue-500 hover:bg-blue-700 text-sm md:text-base">
                  SignUp
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <Avatar className="relative inline-block h-10 w-10 md:h-16 md:w-16 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                  <AvatarImage
                    className="object-cover w-full h-full"
                    src={user?.profile?.profilePhoto}
                    alt="User Profile Photo"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="z-50 bg-white shadow-lg rounded-lg p-4 w-64">
                <div className="flex items-center gap-4 space-y-2">
                  <Avatar>
                    <AvatarImage
                      className="object-cover w-full h-full"
                      src={user?.profile?.profilePhoto}
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col text-gray-600 mt-2">
                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <User2 />
                    <Link to="/profile">
                      <Button variant="link">View Profile</Button>
                    </Link>
                  </div>

                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <LogOut />
                    <Button onClick={logoutHandler} variant="link">
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};
