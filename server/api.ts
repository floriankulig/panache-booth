import express from "express";
import cors from "cors";

import { userController } from "./controllers/user";
import { articleController } from "./controllers/product";
import { orderController } from "./controllers/order";

export const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: false }))

router.use("/user", userController);
router.use("/product", articleController);
router.use("/order", orderController);

router.use((req, res) => {
  res.status(405);
  res.send('Route does not exist');
});

export { router as apiRouter };