import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useGetCompanyById from '../../hooks/useGetCompanyById';
import useGetApplicants from '../../hooks/useGetApplicants';
import useUpdateApplicantStatus from '../../hooks/useUpdateApplicantStatus';
import { Navbar } from '../shared/Navbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const JobApplicants = ({ job }) => {
  const { applicants, setApplicants, loading, error } = useGetApplicants(job._id);
  const { updateStatus } = useUpdateApplicantStatus();

  const handleStatusUpdate = async (applicationId, status) => {
    const updatedApplication = await updateStatus(applicationId, status);
    if (updatedApplication) {
      setApplicants(prevApplicants => 
        prevApplicants.map(app => 
          app._id === applicationId ? { ...app, status: updatedApplication.status } : app
        )
      );
    }
  };

  if (loading) return <p>Loading applicants...</p>;
  if (error) return <p>Error loading applicants.</p>;

  return (
    <div className='my-4'>
      <h3 className='font-semibold text-lg'>{job.title}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map(application => (
            <TableRow key={application._id}>
              <TableCell>{application.applicant.fullName}</TableCell>
              <TableCell>{application.applicant.email}</TableCell>
              <TableCell>
                <Badge className={`${{
                  pending: 'bg-yellow-400',
                  accepted: 'bg-green-500',
                  rejected: 'bg-red-600',
                }[application.status.toLowerCase()] || 'bg-gray-400'}`}>
                  {application.status}
                </Badge>
              </TableCell>
              <TableCell>
                {application.status.toLowerCase() === 'pending' && (
                  <>
                    <Button onClick={() => handleStatusUpdate(application._id, 'accepted')} className='bg-green-500 hover:bg-green-600 mr-2'>Accept</Button>
                    <Button onClick={() => handleStatusUpdate(application._id, 'rejected')} className='bg-red-600 hover:bg-red-700'>Reject</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const ManageApplications = () => {
  const { user } = useSelector(store => store.auth);
  // This assumes the admin user object has a companyId field.
  const { company } = useGetCompanyById(user?.companyId);

  return (
    <div className='bg-gray-50 min-h-screen'>
      <Navbar />
      <div className='max-w-7xl mx-auto py-8 px-4'>
        <h1 className='font-bold text-3xl text-center mb-6 text-blue-700'>Manage Applications</h1>
        {company?.jobs?.length > 0 ? (
          company.jobs.map(job => (
            <JobApplicants key={job._id} job={job} />
          ))
        ) : (
          <p className='text-center text-gray-500'>No jobs found for your company.</p>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;