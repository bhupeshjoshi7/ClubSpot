import React, { useState } from "react";
import { Navbar } from "../shared/Navbar";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant.jsx";
import axios from "axios";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    sid: "",
    file: "",
    otp: "",
  });
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const requestOtpHandler = async (e) => {
    e.preventDefault();

    if (!input.fullname || !input.email || !input.password || !input.role) {
      toast.error("Please fill all required fields");
      return;
    }
    if (input.role === 'student' && (!input.sid || !input.phoneNumber)) {
      toast.error("Student ID and Phone Number are required");
      return;
    }
    if (!input.email.toLowerCase().endsWith("@pec.edu.in")) {
      toast.error("You must use a @pec.edu.in email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${USER_API_END_POINT}/request-otp`, { email: input.email }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to request OTP");
    } finally {
      setLoading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.otp) {
      toast.error("Please enter the OTP sent to your email.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("password", input.password);
    formData.append("role", input.role);
    formData.append("otp", input.otp);

    if (input.role === "student") {
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("sid", input.sid);
    }

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={step === 1 ? requestOtpHandler : submitHandler}
          className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 border border-gray-200 rounded-md p-10 my-10 shadow-md"
        >
          <h1 className="text-2xl font-bold mb-10 text-center text-gray-800">
            {step === 1 ? "Signup" : "Verify Email"}
          </h1>

          {step === 1 ? (
            <>
              <div className="my-3">
                <Label>Full Name</Label>
                <Input
                  className="my-2 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
                  type="text"
                  value={input.fullname}
                  name="fullname"
                  onChange={changeEventHandler}
                  placeholder="Bhupesh"
                  required
                />
              </div>

              <div className="my-3">
                <Label>Email</Label>
                <Input
                  className="my-2 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
                  type="email"
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  placeholder="Bhupesh@email.com"
                  required
                />
              </div>

              {input.role === 'student' && (
                <div className="my-3">
                  <Label>Student ID (SID)</Label>
                  <Input
                    className="my-2 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
                    type="text"
                    value={input.sid || ""}
                    name="sid"
                    onChange={changeEventHandler}
                    placeholder="2110XXXX"
                    required
                  />
                </div>
              )}

              {input.role === 'student' && (
                <div className="my-3">
                  <Label>Phone Number</Label>
                  <Input
                    className="my-2 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
                    type="text"
                    value={input.phoneNumber}
                    name="phoneNumber"
                    onChange={changeEventHandler}
                    placeholder="Phone Number"
                    required
                  />
                </div>
              )}

              <div className="my-3">
                <Label>Password</Label>
                <Input
                  className="my-2 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300"
                  type="password"
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  placeholder="Password"
                  required
                />
              </div>

              <div className="my-4">
                <Label className="block mb-1">Role</Label>
                <RadioGroup className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Input
                      type="radio"
                      name="role"
                      value="student"
                      checked={input.role === 'student'}
                      onChange={changeEventHandler}
                      className="cursor-pointer"
                    />
                    <Label className="ml-2 font-medium">Student</Label>
                  </div>
                  <div className="flex items-center">
                    <Input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={input.role === 'admin'}
                      onChange={changeEventHandler}
                      className="cursor-pointer"
                    />
                    <Label className="ml-2 font-medium">Admin</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          ) : (
            <>
              <div className="my-3">
                <Label>Verification OTP</Label>
                <p className="text-sm text-gray-500 mb-2">We sent a 6-digit code to {input.email}. Please enter it below.</p>
                <Input
                  className="my-2 border-gray-300 text-center text-2xl tracking-widest rounded-md shadow-sm focus:ring focus:ring-blue-300"
                  type="text"
                  maxLength={6}
                  value={input.otp}
                  name="otp"
                  onChange={changeEventHandler}
                  placeholder="000000"
                  required
                />
              </div>
            </>
          )}

          {/* <div className="my-3">
            <Label className="block mb-1">Profile Photo</Label>
            <Input
              accept="image/*"
              type="file"
              onChange={changeFileHandler}
              className="cursor-pointer w-full text-gray-700"
            />
          </div> */}

          <Button type="submit" className="w-full my-4" disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
                Please wait...
              </div>
            ) : (
              step === 1 ? "Send OTP" : "Verify & Signup"
            )}
          </Button>

          {step === 1 && (
            <span className="text-sm text-center block mt-4">
              Already Registered? <Link to="/login" className="text-blue-600 hover:underline">LogIn</Link>
            </span>
          )}
          {step === 2 && (
            <div className="text-center mt-2">
              <Button type="button" variant="link" onClick={() => setStep(1)} className="text-gray-500">
                Wrong email? Go back
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Signup;
