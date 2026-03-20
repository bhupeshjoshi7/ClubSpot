// Foolproof auto-detection (Bypasses Vercel Dashboard bugs entirely)
// const BASE_URL = import.meta.env.VITE_BACKEND_URL ||
//     (window.location.hostname === "localhost" ? "http://localhost:8000" : "https://clubspot.onrender.com");
const BASE_URL = "https://clubspot.onrender.com";
export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const CL_API_END_POINT = `${BASE_URL}/api/v1/company`;
export const EVENT_API_END_POINT = `${BASE_URL}/api/v1/event`;
