import React, { useState } from "react";
import { Navbar } from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const requestOtpHandler = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password/request-otp`, { email }, { withCredentials: true });
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

    const resetPasswordHandler = async (e) => {
        e.preventDefault();
        if (!otp || !newPassword) {
            toast.error("Please enter the OTP and a new password.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/forgot-password/reset`, { email, otp, newPassword }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <form
                    onSubmit={step === 1 ? requestOtpHandler : resetPasswordHandler}
                    className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 border border-gray-200 rounded-md p-10 my-10 shadow-md"
                >
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                        {step === 1 ? "Forgot Password" : "Reset Password"}
                    </h1>

                    {step === 1 ? (
                        <>
                            <p className="text-sm text-gray-600 mb-6 text-center">
                                Enter your registered email address and we'll send you an OTP to reset your password.
                            </p>
                            <div className="my-3">
                                <Label>Email</Label>
                                <Input
                                    className="my-2"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@pec.edu.in"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="my-3">
                                <Label>OTP</Label>
                                <p className="text-xs text-gray-500 mb-2">Code sent to {email}</p>
                                <Input
                                    className="my-2 text-center text-xl tracking-widest"
                                    type="text"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="000000"
                                    required
                                />
                            </div>
                            <div className="my-3">
                                <Label>New Password</Label>
                                <Input
                                    className="my-2"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new strong password"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <Button type="submit" className="w-full my-4" disabled={loading}>
                        {loading ? "Processing..." : step === 1 ? "Send OTP" : "Reset Password"}
                    </Button>

                    {step === 2 && (
                        <div className="text-center mt-2">
                            <Button type="button" variant="link" onClick={() => setStep(1)} className="text-gray-500">
                                Didn't receive code? Change email
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
