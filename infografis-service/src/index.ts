import dotenv from "dotenv";
import { web } from "./application/web";
import {
  seedExtraIdm,
  seedPenduduk,
  seedSdgs,
} from "./seeder/infografis-seeder";

dotenv.config();

seedPenduduk();
seedSdgs();
seedExtraIdm();

const port = parseInt(process.env.PORT ?? "3000");

web.listen(port, () => {
  console.log(`Liten at port ${port}`);
});
