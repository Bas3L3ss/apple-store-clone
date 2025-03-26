import express from "express";
import checkBearerToken from "../middlewares/check-bearer-token";
import errorHandler from "../middlewares/error-handler";
import { GetProductById } from "../controllers/product/get-product-by-id";
import { GetProducts } from "../controllers/product/get-products";
import { CreateProduct } from "../controllers/product/create-product";
import checkAdminRole from "../controllers/auth/check-admin-role";
import { GetFeaturedProducts } from "../controllers/product/get-featured-products";
import { GetProductBySlug } from "../controllers/product/get-product-by-slug";
import { GetProductRecommendations } from "../controllers/product/get-product-recommendations";
import { EditProduct } from "../controllers/product/edit-product";
import multer from "multer";

// import { CreateMockProduct } from "../controllers/product/create-random-mockdata";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const router = express.Router();

// ADMIN ROUTES
//
router.post(
  "/",
  [
    upload.array("productImages", 10),
    checkBearerToken,
    checkAdminRole,

    CreateProduct,
  ],
  errorHandler
);
router.put(
  "/",
  [
    upload.array("productImages", 10),
    checkBearerToken,
    checkAdminRole,
    EditProduct,
  ],
  errorHandler
);

// USER
// GET: Fetch all products
router.get("/", GetProducts, errorHandler);

// GET: Fetch a number of featured products
router.get("/featured", GetFeaturedProducts, errorHandler);

// GET: Fetch recommended products by category and with amoun
router.get("/recommendations", GetProductRecommendations, errorHandler);

// GET: Fetch a single product by Slug
router.get("/slug/:slug", GetProductBySlug, errorHandler);

// GET: Fetch a single product by ID
router.get("/:id", GetProductById, errorHandler);

// router.post(
//   "/test",
//   [checkBearerToken, checkAdminRole, CreateMockProduct],
//   errorHandler
// );

export default router;
