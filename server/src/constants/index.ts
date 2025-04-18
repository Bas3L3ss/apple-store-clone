import dotenv from "dotenv";
dotenv.config();
const ORIGIN = "*";
const PORT = process.env.PORT || 5000;
const ISDEVELOPMENT = process.env.NODE_ENV == "development";
const HMAC_SECRET = process.env.HMAC_SECRET || "unsafe_secret";
const APP_URL = process.env.APP_URL ?? "http://localhost:5173";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://userpass:userpass@cluster0.x7g93.mongodb.net/apple-store";
const MONGO_OPTIONS = {};

const REDIS_URL = process.env.REDIS_URL || "redis";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:5000";

const JWT_SECRET = process.env.JWT_SECRET || "unsafe_secret";

const WEBHOOKSECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

const EMAIL = process.env.EMAIL ?? "";
const PASSWORD = process.env.PASSWORD ?? "";
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ?? "";
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "";

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
  REDIS_URL,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  HMAC_SECRET,
};
