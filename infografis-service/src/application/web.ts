import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/error-middleware";
import { publicRouter } from "../router/public-router";
import { adminRouter } from "../router/admin-router";

export const web = express();


web.use(express.json());

web.use("/api/infografis", publicRouter);
web.use("/api/infografis/admin", adminRouter);

web.use(errorMiddleware);
