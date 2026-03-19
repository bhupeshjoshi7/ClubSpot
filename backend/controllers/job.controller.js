import { Job } from "../model/job.model.js";

export const postJob = async (req, res) => {
    try {
        const { title, discription, salary, requirements, location, companyId } = req.body;
        const userId = req.id;
        const role = req.role;
        if (!title || !discription || !salary || !requirements || !location || !companyId) {
            res.status(400).json({
                msg: "something is missing",
                success: false
            })
        };
        if (role != 'recruiter') {
            res.status(403).json({
                message: "You are not recruiter",
                success: false
            })
        }
        const job = await Job.create({
            title,
            discription,
            salary,
            requirements: requirements.split(","),
            location,
            company: companyId,
            created_by: userId,
        })
        return res.status(201).json({
            message: "New job created",
            job,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { discription: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(200).json({
                message: "No jobs found.",
                jobs: [],
                success: true
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log("Error in getAllJobs:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        }).populate({
            path: "company"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getJobsByCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const jobs = await Job.find({ company: companyId }).populate({
            path: "company"
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const toggleJobStatus = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        job.isActive = !job.isActive;
        await job.save();

        return res.status(200).json({
            message: `Position is now ${job.isActive ? 'Open' : 'Closed'}`,
            job,
            success: true
        });
    } catch (error) {
        console.log("Error in toggleJobStatus:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}