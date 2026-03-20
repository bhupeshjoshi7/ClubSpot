import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "dns";

// Force Node to use IPv4 resolution to prevent ENETUNREACH crashes on misconfigured IPv6 networks
dns.setDefaultResultOrder('ipv4first');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: process.env.EMAIL_USER || '', // e.g. clubspot@gmail.com
        pass: process.env.EMAIL_PASS || '', // App password
    },
    // Explicitly force IPv4 network resolving. Render's background IPv6 routing will crash Nodemailer otherwise.
    family: 4
});

export const sendEmail = async (to, subject, text, html) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log("=========================================");
            console.log(`[MOCK EMAIL] To: ${to}`);
            console.log(`[SUBJECT]: ${subject}`);
            console.log(`[CONTENT]:\n${text}`);
            console.log("=========================================");
            return true;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return true;
    } catch (error) {
        console.error("Error sending email: ", error);
        return false;
    }
};
