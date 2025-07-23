import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/error-middleware";
import { publicRouter } from "../router/public-router";
import { adminRouter } from "../router/admin-router";
import { privateRouter } from "../router/private-router";

export const web = express();

// const allowedOrigins = ["http://103.189.235.67/"];

// web.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

web.use(express.json());

web.use("/api/users", publicRouter);
web.use("/api/users", privateRouter);
web.use("/api/users", adminRouter);

web.use(errorMiddleware);
