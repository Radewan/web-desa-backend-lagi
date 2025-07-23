import dotenv from "dotenv";
import { web } from "./application/web";
import path from "node:path";

dotenv.config();

const port = parseInt(process.env.PORT ?? "3000");

web.listen(port, () => {
  console.log(`Liten at port ${port}`);
});
