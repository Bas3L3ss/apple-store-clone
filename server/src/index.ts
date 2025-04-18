import dotenv from "dotenv";
dotenv.config();

import app from "./utils/app"; // (server)
import mongo from "./utils/mongo"; // (database)
import redis from "./utils/redis"; // (cache)
import helper from "./utils/helper";
import { PORT } from "./constants/index";
import authRoutes from "./routes/auth";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/order";
import productRoutes from "./routes/product";
import stripeRoutes from "./routes/checkout";
import analyticsRoutes from "./routes/analytics";
import productOptionRoutes from "./routes/product-options";
import { invalidateAllProductCaches } from "./controllers/product/utils/invalidate-product-cache";
import { invalidateUserCache } from "./controllers/auth/utils/invalidate-user-cache";
import { invalidateFeaturedProductsCache } from "./controllers/product/utils/invalidate-featured-products-cache";
import { invalidateUserOrderCaches } from "./controllers/order/utils/invalidate-user-order-cache";
import { invalidateProductsCache } from "./controllers/product/utils/invalidate-products-cache";
import { invalidateCustomerAnalyticsCache } from "./controllers/order/utils/invalidate.customer.analytics-cache";
import { handleEmailMessage } from "./utils/notifications";
import { invalidateUsersCache } from "./controllers/auth/utils/invalidate-users-cache";

const bootstrap = async () => {
  await mongo.connect();
  await redis.connect();

  app.get("/", (req, res) => {
    res.status(200).send("Hello, world!");
  });

  app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/auth", authRoutes);
  app.use("/products", productRoutes);
  app.use("/orders", orderRoutes);
  app.use("/carts", cartRoutes);
  app.use("/checkout", stripeRoutes);
  app.use("/analytics", analyticsRoutes);
  app.use("/product-options", productOptionRoutes);

  await redis.subscribe("product-modified", async (message) => {
    const data = await helper.safeParse(message);
    if (!data) return;
    await invalidateAllProductCaches(data.productId, data.slug);
  });
  await redis.subscribe("product-created", async () => {
    await invalidateProductsCache();
  });
  await redis.subscribe("product-deleted", async () => {
    await invalidateProductsCache();
  });

  await redis.subscribe("user-modified", async (message) => {
    const data = await helper.safeParse(message);
    if (!data) return;
    await invalidateUserCache(data.userId, data.isFromAdminEdit);
  });
  await redis.subscribe("user-deleted", async () => {
    invalidateUsersCache();
  });

  await redis.subscribe("featured-product-modified", () => {
    invalidateFeaturedProductsCache();
  });

  await redis.subscribe("user-order-modified", async (message) => {
    const data = await helper.safeParse(message);
    if (!data) return;
    await invalidateUserOrderCaches(data.userId);
  });

  await redis.subscribe("user-order-modified", async (message) => {
    const data = await helper.safeParse(message);
    if (!data) return;
    await invalidateCustomerAnalyticsCache(data.email);
  });

  await redis.subscribe("send-email", async (message) => {
    await handleEmailMessage(message);
  });

  app.listen(PORT, () => {
    console.log(`✅ Server is listening on port: ${PORT}`);
  });
};

bootstrap();
