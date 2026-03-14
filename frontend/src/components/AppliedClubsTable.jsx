import React from 'react';
import { Navbar } from './shared/Navbar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import useGetAppliedClubs from '../hooks/useGetAppliedClubs';
import { useSelector } from 'react-redux';

const AppliedClubsTable = () => {
  const { appliedClubs, loading, error } = useGetAppliedClubs();
  const { user } = useSelector(store => store.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className="flex justify-center min-h-screen py-8">
        <div className="p-8 w-full max-w-4xl bg-white shadow-lg rounded-lg">
          <h1 className="font-bold text-3xl text-center mb-6 text-blue-700">My Applications</h1>
          <Table className="w-full my-10">
            <TableCaption>A list of your recent applications.</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-left">Date</TableHead>
                <TableHead className="text-center">Club Name</TableHead>
                <TableHead className="text-center">Position</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appliedClubs.map((application) => (
                <TableRow
                  className="hover:bg-blue-50 transition-colors duration-200"
                  key={application._id}
                >
                  <TableCell className="text-left">{new Date(application.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">{application.job.company.name}</TableCell>
                  <TableCell className="text-center">{application.job.title}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      className={`${{
                        pending: 'bg-yellow-400',
                        accepted: 'bg-green-500',
                        rejected: 'bg-red-600',
                      }[application.status.toLowerCase()] || 'bg-gray-400'}`}>
                      {application.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AppliedClubsTable;