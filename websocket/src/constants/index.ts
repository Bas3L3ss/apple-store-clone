import dotenv from "dotenv";
dotenv.config();
const ORIGIN = "*";
const PORT = process.env.PORT || 3001;
const ISDEVELOPMENT = process.env.NODE_ENV == "development";
const APP_URL = process.env.APP_URL ?? "http://localhost:5173";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://yourcredentials:yourcredentials@cluster0mongodb.net/apple-store"; //fake
const MONGO_OPTIONS = {};

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

const JWT_SECRET = process.env.JWT_SECRET || "unsafe_secret";

const WEBHOOKSECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

const EMAIL = process.env.EMAIL ?? "";
const PASSWORD = process.env.PASSWORD ?? "";

export {
  ISDEVELOPMENT,
  ORIGIN,
  EMAIL,
  PORT,
  MONGO_URI,
  MONGO_OPTIONS,
  JWT_SECRET,
  WEBHOOKSECRET,
  PASSWORD,
  APP_URL,
  BACKEND_URL,
};
