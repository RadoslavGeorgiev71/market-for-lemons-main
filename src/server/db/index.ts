import "dotenv/config";
import postgres from "postgres";

const DATABASE_URL = process.env.DATABASE_URL;

console.log("DATABASE_URL", DATABASE_URL);

if (!DATABASE_URL) {
  console.error("DATABASE_URL in the .env file has not been set properly!");
  throw new Error("DATABASE_URL is required");
}

const sql = postgres(DATABASE_URL);

export default sql;
