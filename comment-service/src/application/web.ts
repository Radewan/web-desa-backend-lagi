import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/error-middleware";
import { publicRouter } from "../router/public-router";
import { privateRouter } from "../router/private-router";

export const web = express();

web.use(express.json());

web.use("/api/comments", publicRouter);
web.use("/api/comments", privateRouter);

web.use(errorMiddleware);
