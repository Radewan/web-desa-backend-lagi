import dotenv from "dotenv";
import { web } from "./application/web";

dotenv.config();

const port = process.env.PORT ?? "3000";

web.listen(port, () => {
  console.log(`Liten at port ${port}`);
});
