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
    file: null,
  });

  const { singleCompany } = useSelector((store) => store.company);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
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
            <img src={singleCompany?.logo} alt={singleCompany?.name} className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 mb-4"/>
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
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Update Logo</Label>
              <Input type="file" onChange={changeFileHandler} />
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
      </div>
    </div>
  );
};

export default CompanySetup;
