import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/error-middleware";
import { publicRouter } from "../router/public-router";
import path from "node:path";
import { adminRouter } from "../router/admin-router";

export const web = express();

web.use(cors());
web.use(express.json());

web.use(
  "/api/galeri/images",
  express.static(path.join(__dirname, "..", "..", "images"))
);

web.use("/api/galeri", publicRouter);
web.use("/api/galeri/admin", adminRouter);

web.use(errorMiddleware);
