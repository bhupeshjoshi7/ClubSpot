import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>SID</TableHead>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell className="font-semibold text-gray-900 border-r bg-gray-50">{item?.applicant?.profile?.SID || 'NA'}</TableCell>
                                <TableCell className="font-medium text-gray-900">{item?.applicant?.fullname || 'NA'}</TableCell>
                                <TableCell className="text-gray-600">{item?.applicant?.email || 'NA'}</TableCell>
                                <TableCell className="text-gray-600">
                                    <div className="flex items-center gap-1">
                                        📞 {item?.applicant?.phoneNumber || 'NA'}
                                    </div>
                                </TableCell>
                                <TableCell className="text-gray-500 text-sm whitespace-nowrap">{item?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${item?.status?.toLowerCase() === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                                        item?.status?.toLowerCase() === 'rejected' ? 'bg-rose-100 text-rose-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                        {item?.status?.toUpperCase() || 'PENDING'}
                                    </span>
                                </TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div onClick={() => statusHandler(status, item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer'>
                                                            <span>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>

                                </TableCell>
                            </tr>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable
