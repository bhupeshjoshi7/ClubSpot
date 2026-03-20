import { Company } from "../model/company.model.js";
import { User } from "../model/user.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcryptjs";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        //const user = await User.findById(req.id); 
        if (req.role !== 'admin') {
            return res.status(403).json({
                message: "You are not authorized to register a company.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };

        company = await Company.create({
            name: companyName,
            userId: req.id
        });


        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, about, pptLink, instagram, linkedin, twitter, website } = req.body;
        const file = req.file;
        let logo = "";
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logo = cloudResponse.secure_url;
        }

        const updateData = { name, description };
        if (about !== undefined) updateData.about = about;
        if (pptLink !== undefined) updateData.pptLink = pptLink;
        if (logo) updateData.logo = logo;

        // Assign socials safely if any were provided
        updateData.socials = {};
        if (instagram !== undefined) updateData.socials.instagram = instagram;
        if (linkedin !== undefined) updateData.socials.linkedin = linkedin;
        if (twitter !== undefined) updateData.socials.twitter = twitter;
        if (website !== undefined) updateData.socials.website = website;

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message: "Company information updated.",
            success: true,
            company: company
        })

    } catch (error) {
        console.log(error);
    }
}

export const getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        if (!companies) {
            return res.status(404).json({
                message: "No companies found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const userId = req.id;

        if (!password) {
            return res.status(400).json({ message: "Password is required to delete the club.", success: false });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found.", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect password. Deletion aborted.", success: false });
        }

        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({ message: "Club not found.", success: false });
        }

        // Optional: delete associated jobs and events. For now, just delete the company.
        await Company.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Club deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
}