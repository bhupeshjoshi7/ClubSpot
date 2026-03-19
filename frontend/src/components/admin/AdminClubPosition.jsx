import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Edit2, MoreHorizontal } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAdminJobs from "@/hooks/useGetAdminJobs";
import { Users, Power } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { JOB_API_END_POINT } from "@/utils/constant";
import { setAllAdminJobs } from "@/redux/clubSlice";

const AdminClubPosition = () => {
  useGetAdminJobs();
  const { allAdminJobs } = useSelector((store) => store.club);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleToggleStatus = async (jobId) => {
    try {
      const res = await axios.post(`${JOB_API_END_POINT}/toggle/${jobId}`, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        // Update local state to reflect change immediately
        const updatedJobs = allAdminJobs.map(job =>
          job._id === jobId ? { ...job, isActive: !job.isActive } : job
        );
        dispatch(setAllAdminJobs(updatedJobs));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating position status");
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Recent Opened Club Position</h1>
      <Table className="min-w-full border-separate border-spacing-y-2">
        <TableCaption className="mb-4 text-gray-500">List of Recent Opened Club Position</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="py-3 text-lg">Club Name</TableHead>
            <TableHead className="py-3 text-lg">Position</TableHead>
            <TableHead className="py-3 text-lg">Date</TableHead>
            <TableHead className="py-3 text-lg text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!allAdminJobs || allAdminJobs.length <= 0 ? (
            <tr>
              <TableCell colSpan="4" className="text-center py-6 text-gray-500">
                No Clubs position openings
              </TableCell>
            </tr>
          ) : (
            <>
              {allAdminJobs?.map((job) => {
                return (
                  <TableRow
                    key={job._id}
                    className="hover:bg-gray-50 transition-colors duration-300 ease-in-out"
                  >

                    <TableCell className="py-3 text-lg font-medium text-gray-800">
                      {job?.company?.name}
                    </TableCell>
                    <TableCell className="py-3 text-lg font-medium text-blue-600 flex items-center gap-2">
                      {job?.title}
                      <span className={`text-xs px-2 py-1 rounded-full ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {job.isActive ? 'Active' : 'Closed'}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 text-gray-600 text-md">
                      {job?.createdAt?.split("T")[0]}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <Popover>
                        <PopoverTrigger>
                          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                            <MoreHorizontal className="text-gray-500" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 bg-white shadow-md rounded-lg flex flex-col w-32">
                          <button
                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Users className="h-4 w-4 text-gray-500" />
                            <span>Applicants</span>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(job._id)}
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Power className={`h-4 w-4 ${job.isActive ? 'text-red-500' : 'text-green-500'}`} />
                            <span>{job.isActive ? 'Close Position' : 'Open Position'}</span>
                          </button>
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                );
              })}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminClubPosition;
