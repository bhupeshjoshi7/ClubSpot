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
import { Edit2, MoreHorizontal, Calendar } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CompaniesTable = () => {
  const { companies } = useSelector((store) => store.company);
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Recent Applied Clubs</h1>
      <Table className="min-w-full border-separate border-spacing-y-2">
        <TableCaption className="mb-4 text-gray-500">List of Recent Applied Clubs</TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="py-3 text-lg">Logo</TableHead>
            <TableHead className="py-3 text-lg">Name</TableHead>
            <TableHead className="py-3 text-lg">Date</TableHead>
            <TableHead className="py-3 text-lg text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.length <= 0 ? (
            <tr>
              <TableCell colSpan="4" className="text-center py-6 text-gray-500">
                No Clubs Registered
              </TableCell>
            </tr>
          ) : (
            <>
              {companies?.map((company) => {
                return (
                  <TableRow
                    key={company._id}
                    className="hover:bg-gray-50 transition-colors duration-300 ease-in-out"
                  >
                    <TableCell className="py-3">
                      <Avatar className="border-2 border-gray-200 shadow-sm">
                        <AvatarImage
                          className="h-24 w-24 rounded-full object-cover" // Increased size
                          src={company?.logo}
                          alt="Club Logo"
                        />
                      </Avatar>
                    </TableCell>
                    <TableCell className="py-3 text-lg font-medium text-gray-800">
                      {company?.name}
                    </TableCell>
                    <TableCell className="py-3 text-gray-600 text-md">
                      {company?.createdAt.split("T")[0]}
                    </TableCell>
                    <TableCell className="py-3 text-right">
                      <Popover>
                        <PopoverTrigger>
                          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                            <MoreHorizontal className="text-gray-500" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 bg-white shadow-md rounded-lg flex flex-col w-40">
                          <button
                            onClick={() => navigate(`/admin/companies/${company._id}`)}
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Edit2 className="h-4 w-4 text-gray-500" />
                            <span>Edit Details</span>
                          </button>
                          <button
                            onClick={() => navigate(`/admin/companies/${company._id}/events`)}
                            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span>Manage Events</span>
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

export default CompaniesTable;
