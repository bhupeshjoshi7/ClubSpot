import React, { useEffect, useState } from "react";
import { Navbar } from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react"; // Loader icon from lucide-react
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { CL_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";

const CompanySetup = () => {
  const params = useParams();
  useGetCompanyById(params.id);
  const [input, setInput] = useState({
    name: "",
    description: "",
    about: "",
    pptLink: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    website: "",
    file: null,
  });

  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting API call

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("description", input.description);
    formData.append("about", input.about);
    formData.append("pptLink", input.pptLink);
    formData.append("instagram", input.instagram);
    formData.append("linkedin", input.linkedin);
    formData.append("twitter", input.twitter);
    formData.append("website", input.website);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.put(
        `${CL_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false); // Set loading to false after API call completes
    }
  };

  const deleteClubHandler = async () => {
    if (!deletePassword) {
      toast.error("Please enter your password to confirm.");
      return;
    }
    setDeleting(true);
    try {
      const res = await axios.post(
        `${CL_API_END_POINT}/delete/${params.id}`,
        { password: deletePassword },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete the club.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        about: singleCompany.about || "",
        pptLink: singleCompany.pptLink || "",
        instagram: singleCompany.socials?.instagram || "",
        linkedin: singleCompany.socials?.linkedin || "",
        twitter: singleCompany.socials?.twitter || "",
        website: singleCompany.socials?.website || "",
        file: null,
      });
    }
  }, [singleCompany]);

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-lg rounded-lg">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/admin/companies")}
            variant="outline"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-3xl font-bold">Club Details</h1>
        </div>

        {/* Display Company Details */}
        <div className="mb-10 flex flex-col items-center">
          <img src={singleCompany?.logo} alt={singleCompany?.name} className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4" />
          <h2 className="text-2xl font-semibold">{singleCompany?.name}</h2>
          <p className="text-gray-600 mt-2 text-center">{singleCompany?.description}</p>
        </div>

        {/* Update Form */}
        <form onSubmit={submitHandler}>
          <h2 className="text-xl font-bold mb-6 border-t pt-6">Update Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Club Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Club Description</Label>
              <textarea
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="md:col-span-2">
              <Label>About</Label>
              <textarea
                name="about"
                value={input.about}
                onChange={changeEventHandler}
                placeholder="Detailed information about the club..."
                className="flex min-h-[150px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="md:col-span-2">
              <Label>PPT Link</Label>
              <Input
                type="text"
                name="pptLink"
                value={input.pptLink}
                onChange={changeEventHandler}
                placeholder="https://docs.google.com/presentation/..."
              />
            </div>

            <div className="md:col-span-2 pt-6 border-t border-gray-100 mt-2">
              <h3 className="text-lg font-bold mb-4 text-gray-800">Social Handles (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Instagram URL</Label>
                  <Input type="text" name="instagram" value={input.instagram} onChange={changeEventHandler} placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input type="text" name="linkedin" value={input.linkedin} onChange={changeEventHandler} placeholder="https://linkedin.com/in/..." />
                </div>
                <div>
                  <Label>Twitter/X URL</Label>
                  <Input type="text" name="twitter" value={input.twitter} onChange={changeEventHandler} placeholder="https://twitter.com/..." />
                </div>
                <div>
                  <Label>Website URL</Label>
                  <Input type="text" name="website" value={input.website} onChange={changeEventHandler} placeholder="https://example.com" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-6 border-t border-gray-100 mt-2">
              <Label>Update Logo</Label>
              <Input type="file" onChange={changeFileHandler} className="mt-2" />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full mt-8"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Updating...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>

        {/* Danger Zone */}
        <div className="mt-12 pt-8 border-t border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-2">Delete this Club</h3>
            <p className="text-sm text-red-600 mb-6">Once deleted, it will be gone forever. Please be certain.</p>

            {!showDeletePrompt ? (
              <Button onClick={() => setShowDeletePrompt(true)} variant="destructive">
                Delete Club
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-red-800">Confirm Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter your account password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="mt-2 border-red-300 focus-visible:ring-red-500"
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={deleteClubHandler} variant="destructive" disabled={deleting}>
                    {deleting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    Confirm Delete
                  </Button>
                  <Button onClick={() => { setShowDeletePrompt(false); setDeletePassword(""); }} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
