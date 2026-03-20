import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js"
import jobRoute from "./routes/job.route.js"
import applicationRoute from "./routes/application.route.js"
import eventRoute from "./routes/event.route.js"
dotenv.config({});


const app = express();

// Trust reverse proxy (Required for Render & express-rate-limit)
app.set('trust proxy', 1);

app.get("/home", (req, res) => {
    return res.status(200).json({
        msg: "backend",
        success: true
    })
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Production Security Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL Injection

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // Limit each IP to 150 requests per window
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter); // Apply rate limiting to all API routes

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, postman, curl)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'https://club-spot.vercel.app'
        ];

        // Dynamically allow the true production URL, localtest, AND all Vercel Preview Branch URLs
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}
app.use(cors(corsOptions));


const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/event", eventRoute);



app.listen(PORT, () => {
    connectDB();
    console.log(`Server at ${PORT}`);

})