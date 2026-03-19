import React, { useEffect, useState } from 'react';
import { Navbar } from './shared/Navbar';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';
import { Loader2, Trash2, PlusCircle } from 'lucide-react';

const AppliedClubsTable = () => {
  const [appliedClubs, setAppliedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAppliedClubs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
      if (res.data.success) {
        setAppliedClubs(res.data.application);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch applied clubs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppliedClubs();
  }, []);

  const handleWithdraw = async (id) => {
    try {
      const res = await axios.delete(`${APPLICATION_API_END_POINT}/withdraw/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setAppliedClubs(appliedClubs.filter(app => app._id !== id));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to withdraw application");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="font-extrabold text-4xl text-gray-900 tracking-tight">My Club Applications</h1>
            <p className="text-gray-500 mt-2">Track your recruitment status and manage your applications.</p>
          </div>
          <Button
            onClick={() => navigate('/clubs')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-6 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-blue-200"
          >
            <PlusCircle size={20} />
            Apply to New Clubs
          </Button>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
          <Table className="w-full">
            <TableCaption className="pb-6">A list of your club applications and their current status.</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="py-5 px-6 font-bold text-gray-700">Date</TableHead>
                <TableHead className="py-5 px-6 font-bold text-gray-700">Club Name</TableHead>
                <TableHead className="py-5 px-6 font-bold text-gray-700">Position</TableHead>
                <TableHead className="py-5 px-6 font-bold text-gray-700 text-center">Status</TableHead>
                <TableHead className="py-5 px-6 font-bold text-gray-700 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appliedClubs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg font-medium">No applications found</p>
                      <Button variant="link" onClick={() => navigate('/clubs')} className="text-blue-600">
                        Browse clubs and start applying!
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                appliedClubs.map((application) => (
                  <TableRow
                    className="hover:bg-blue-50/30 transition-colors duration-200 border-b border-gray-50 last:border-0"
                    key={application._id}
                  >
                    <TableCell className="py-4 px-6 font-medium text-gray-600">
                      {application.createdAt ? new Date(application.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : "N/A"}
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                          {application?.job?.company?.name?.charAt(0) || '?'}
                        </div>
                        <span className="font-semibold text-gray-900">{application?.job?.company?.name || 'Deleted Club'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-gray-600 font-medium">{application?.job?.title || 'Unknown Position'}</TableCell>
                    <TableCell className="py-4 px-6 text-center">
                      <Badge
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${{
                          pending: 'bg-amber-100 text-amber-700 border-amber-200',
                          accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-sm ring-2 ring-emerald-500/20',
                          rejected: 'bg-rose-100 text-rose-700 border-rose-200',
                        }[(application?.status || 'pending').toLowerCase()] || 'bg-slate-100 text-slate-700'
                          }`}
                      >
                        {application?.status || 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      {application?.status?.toLowerCase() !== 'accepted' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleWithdraw(application._id)}
                          className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors group"
                          title="Withdraw Application"
                        >
                          <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="sr-only">Withdraw</span>
                        </Button>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-sm">Secured</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AppliedClubsTable;