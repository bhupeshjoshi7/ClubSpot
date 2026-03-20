import React, { useEffect } from 'react'
import { Navbar } from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'
import { ArrowLeft, Download } from 'lucide-react'
import { Button } from '../ui/button'
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Applicants = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.text(`Applicants for: ${applicants?.title || 'Position'}`, 14, 15);

        const tableColumn = ["SID", "Name", "Email", "Phone", "Status", "Date Applied"];
        const tableRows = [];

        applicants?.applications?.forEach(app => {
            const rowData = [
                app?.applicant?.profile?.SID || 'NA',
                app?.applicant?.fullname || 'NA',
                app?.applicant?.email || 'NA',
                app?.applicant?.phoneNumber?.toString() || 'NA',
                app?.status?.toUpperCase() || 'PENDING',
                app?.createdAt?.split("T")[0] || 'NA'
            ];
            tableRows.push(rowData);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save(`applicants_${applicants?.title?.replace(/\s+/g, '_') || 'export'}.pdf`);
    };

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);


    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto'>
                <div className='flex items-center justify-between my-5'>
                    <div className='flex items-center gap-4'>
                        <Button onClick={() => navigate(-1)} variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className='font-bold text-xl'>Applicants ({applicants?.applications?.length || 0})</h1>
                    </div>
                    {applicants?.applications?.length > 0 && (
                        <Button onClick={handleExportPDF} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Download className="w-4 h-4" />
                            Export to PDF
                        </Button>
                    )}
                </div>
                <ApplicantsTable />
            </div>
        </div>
    )
}

export default Applicants
